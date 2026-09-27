const { formatDate } = require('../../lib/formatter');

module.exports = {
    name: "groupinfo",
    alias: ["infogrup"],
    category: "group",
    description: "Menampilkan informasi grup",
    ownerOnly: false,
    groupOnly: true,
    execute: async (sock, msg, args, ctx) => {
        const metadata = await sock.groupMetadata(msg.chatId);
        const { groupData, config } = ctx;

        const text = `╭───「 *GROUP INFO* 」───╮
│ 📛 Nama: ${metadata.subject}
│ 🆔 ID: ${metadata.id}
│ 👥 Member: ${metadata.participants.length}
│ 👑 Owner: ${metadata.owner ? metadata.owner.split('@')[0] : "-"}
│ 🔗 Welcome: ${groupData.welcome ? "ON" : "OFF"}
│ 🚫 Antilink: ${groupData.antilink ? "ON" : "OFF"}
╰────────────────────╯`;

        await sock.sendMessage(msg.chatId, { text }, { quoted: msg.raw });
    }
};