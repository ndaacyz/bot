const { formatDate, formatNumber } = require('../../lib/formatter');

module.exports = {
    name: "profile",
    alias: ["me", "profil"],
    category: "general",
    description: "Menampilkan profil user",
    ownerOnly: false,
    groupOnly: false,
    execute: async (sock, msg, args, ctx) => {
        const { userData, config } = ctx;

        const text = `╭───「 *PROFILE* 」───╮
│ 👤 Nama: ${msg.pushName}
│ 📱 Nomor: ${msg.sender.split('@')[0]}
│ ⭐ Level: ${userData.level}
│ 📊 Exp: ${formatNumber(userData.exp)}
│ 💰 Money: ${formatNumber(userData.money)}
│ 📅 Terdaftar: ${formatDate(userData.registeredAt, config.timezone)}
│ 🚫 Status: ${userData.banned ? "Banned" : "Aktif"}
╰────────────────────╯`;

        await sock.sendMessage(msg.chatId, { text }, { quoted: msg.raw });
    }
};