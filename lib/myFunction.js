const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function isUrl(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return urlRegex.test(text);
}

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

async function getBuffer(url, options = {}) {
    try {
        const axios = require('axios');
        const res = await axios({
            method: "get",
            url,
            headers: {
                'DNT': 1,
                'Upgrade-Insecure-Request': 1,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 30000, // 30 detik timeout
            ...options,
            responseType: 'arraybuffer'
        });
        return res.data;
    } catch (e) {
        console.error("Error getBuffer:", e.message);
        return null;
    }
}

async function downloadMedia(message, type) {
    try {
        const stream = await downloadContentFromMessage(message, type);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }
        return buffer;
    } catch (e) {
        console.error("Error download media:", e);
        return null;
    }
}

function extractTarget(msg, args) {
    // Prioritas: mention > quoted message > argumen nomor
    if (msg.mentionedJid && msg.mentionedJid.length > 0) {
        return msg.mentionedJid[0];
    }
    if (msg.quoted && msg.quoted.sender) {
        return msg.quoted.sender;
    }
    if (args[0]) {
        let number = args[0].replace(/[^0-9]/g, "");
        if (number.length > 5) {
            return number + "@s.whatsapp.net";
        }
    }
    return null;
}

async function getGroupAdmins(participants) {
    const admins = [];
    for (const p of participants) {
        if (p.admin === "admin" || p.admin === "superadmin") {
            admins.push(p.id);
        }
    }
    return admins;
}

module.exports = {
    sleep,
    isUrl,
    getRandom,
    getBuffer,
    downloadMedia,
    extractTarget,
    getGroupAdmins
};