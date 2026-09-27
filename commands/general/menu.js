const { formatDate } = require('../../lib/formatter');

module.exports = {
    name: "menu",
    alias: ["help", "menu"],
    category: "general",
    description: "Menampilkan daftar semua command",
    ownerOnly: false,
    groupOnly: false,
    execute: async (sock, msg, args, ctx) => {
        const { commands, config, isOwner } = ctx;

        const categories = {};
        for (const [, cmd] of commands) {
            const cat = cmd.category || "lainnya";
            if (!categories[cat]) categories[cat] = [];
            categories[cat].push(cmd);
        }

        let text = `╭───────────────╮\n`;
        text += `   ✦ *${config.botName}* ✦\n`;
        text += `╰───────────────╯\n\n`;
        text += `👤 User: ${msg.pushName}\n`;
        text += `🕐 Waktu: ${formatDate(Date.now(), config.timezone)}\n`;
        text += `🔑 Prefix: ${ctx.prefix}\n\n`;

        for (const [category, cmdList] of Object.entries(categories)) {
            if (category === "owner" && !isOwner) continue;

            text += `📂 *${category.toUpperCase()}*\n`;
            for (const cmd of cmdList) {
                text += `   ▢ ${ctx.prefix}${cmd.name}\n`;
            }
            text += `\n`;
        }

        text += `_${config.footerMenu}_`;

        await sock.sendMessage(msg.chatId, { text }, { quoted: msg.raw });
    }
};