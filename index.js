require('dotenv').config();

const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const qrcode = require('qrcode-terminal');
const path = require('path');

const config = require('./config');
const logger = require('./lib/logger');
const db = require('./lib/database');
const { serialize } = require('./lib/serialize');
const { loadCommands, getUniqueCommands } = require('./lib/commandHandler');
const { extractTarget, getGroupAdmins } = require('./lib/myFunction');

let commands = loadCommands();

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState(
        path.join(__dirname, config.sessionName)
    );
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: false,
        browser: [config.botName, "Chrome", "1.0.0"],
        logger: logger.logger
    });

    // ==== Handle QR Code & Koneksi ====
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            logger.info("Scan QR Code berikut untuk login:");
            qrcode.generate(qr, { small: true });
        }

        if (connection === 'close') {
            const statusCode = new Boom(lastDisconnect?.error)?.output?.statusCode;
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

            logger.warning(`Koneksi terputus. Reconnect: ${shouldReconnect}`);

            if (shouldReconnect) {
                startBot();
            } else {
                logger.error("Session logged out. Hapus folder auth/ dan scan ulang.");
            }
        } else if (connection === 'open') {
            logger.success(`${config.botName} berhasil terkoneksi!`);
        }
    });

    sock.ev.on('creds.update', saveCreds);

    // ==== Handle Update Group (welcome/leave) ====
    sock.ev.on('group-participants.update', async (event) => {
        try {
            const groupData = db.getGroup(event.id);
            if (!groupData.welcome) return;

            const metadata = await sock.groupMetadata(event.id);

            for (const participant of event.participants) {
                const number = participant.split('@')[0];
                if (event.action === 'add') {
                    await sock.sendMessage(event.id, {
                        text: `👋 Selamat datang @${number} di grup *${metadata.subject}*!`,
                        mentions: [participant]
                    });
                } else if (event.action === 'remove') {
                    await sock.sendMessage(event.id, {
                        text: `👋 @${number} telah keluar dari grup.`,
                        mentions: [participant]
                    });
                }
            }
        } catch (e) {
            logger.error(`Error group-participants.update: ${e.message}`);
        }
    });

    // ==== Handle Pesan Masuk ====
    sock.ev.on('messages.upsert', async (chatUpdate) => {
        try {
            const message = chatUpdate.messages[0];
            if (!message.message) return;
            if (message.key && message.key.remoteJid === 'status@broadcast') return;

            const msg = serialize(sock, message);
            if (!msg) return;

            // Auto read
            if (config.autoRead) {
                await sock.readMessages([msg.key]);
            }

            // Pastikan data user & group tersedia
            const userData = db.getUser(msg.sender);
            let groupData = null;

            if (msg.isGroup) {
                groupData = db.getGroup(msg.chatId);
            }

            // Update nama user
            db.setUser(msg.sender, { name: msg.pushName });
            if (msg.isGroup) {
                const metadata = await sock.groupMetadata(msg.chatId).catch(() => null);
                if (metadata) {
                    db.setGroup(msg.chatId, { name: metadata.subject });
                }
            }

            // Cek user banned
            if (userData.banned) return;

            // Cek prefix
            const prefixes = Array.isArray(config.prefix) ? config.prefix : [config.prefix];
            const usedPrefix = prefixes.find((p) => msg.body.startsWith(p));

            if (!usedPrefix) return;

            const args = msg.body.slice(usedPrefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();

            if (!commandName) return;

            const command = commands.get(commandName);
            if (!command) return;

            const isOwner = config.ownerNumber.includes(msg.sender.split('@')[0]);

            // Cek mode public
            if (!config.publicMode && !isOwner) {
                return sock.sendMessage(msg.chatId, {
                    text: "❌ Bot sedang dalam mode private (owner only)."
                }, { quoted: msg.raw });
            }

            // Cek ownerOnly
            if (command.ownerOnly && !isOwner) {
                return sock.sendMessage(msg.chatId, {
                    text: "❌ Perintah ini khusus owner!"
                }, { quoted: msg.raw });
            }

            // Cek groupOnly
            if (command.groupOnly && !msg.isGroup) {
                return sock.sendMessage(msg.chatId, {
                    text: "❌ Perintah ini hanya bisa digunakan di dalam grup!"
                }, { quoted: msg.raw });
            }

            // Cek adminOnly (butuh admin grup)
            let isAdmin = false;
            let isBotAdmin = false;
            if (msg.isGroup) {
                const metadata = await sock.groupMetadata(msg.chatId);
                const admins = await getGroupAdmins(metadata.participants);
                isAdmin = admins.includes(msg.sender);
                isBotAdmin = admins.includes(jidNormalizedUserSafe(sock.user.id));
            }

            if (command.adminOnly && !isAdmin && !isOwner) {
                return sock.sendMessage(msg.chatId, {
                    text: "❌ Perintah ini hanya untuk admin grup!"
                }, { quoted: msg.raw });
            }

            if (command.botAdminRequired && !isBotAdmin) {
                return sock.sendMessage(msg.chatId, {
                    text: "❌ Bot harus menjadi admin untuk menjalankan perintah ini!"
                }, { quoted: msg.raw });
            }

            logger.command(msg.sender, `${usedPrefix}${commandName}`);

            // Context yang dikirim ke setiap command
            const ctx = {
                sender: msg.sender,
                isOwner,
                isAdmin,
                isBotAdmin,
                isGroup: msg.isGroup,
                userData,
                groupData,
                db,
                config,
                commands: getUniqueCommands(commands),
                prefix: usedPrefix,
                extractTarget: (m, a) => extractTarget(m, a)
            };

            try {
                await command.execute(sock, msg, args, ctx);
            } catch (e) {
                logger.error(`Error menjalankan command ${commandName}: ${e.message}`);
                await sock.sendMessage(msg.chatId, {
                    text: `❌ Terjadi error saat menjalankan perintah:\n${e.message}`
                }, { quoted: msg.raw });
            }
        } catch (e) {
            logger.error(`Error messages.upsert: ${e.message}`);
        }
    });

    return sock;
}

function jidNormalizedUserSafe(jid) {
    if (!jid) return "";
    return jid.split(':')[0] + '@s.whatsapp.net';
}

// ==== Inisialisasi ====
db.initDatabase();
startBot();

// ==== Handle Error Global ====
process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.message}`);
});

process.on('unhandledRejection', (err) => {
    logger.error(`Unhandled Rejection: ${err.message}`);
});