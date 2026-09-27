module.exports = {
    name: "promote",
    alias: ["jadikanadmin"],
    category: "group",
    description: "Jadikan member sebagai admin",
    ownerOnly: false,
    groupOnly: true,
    adminOnly: true,
    botAdminRequired: true,
    execute: async (sock, msg, args, ctx) => {
        const target = ctx.extractTarget(msg, args);

        if (!target) {
            return sock.sendMessage(msg.chatId, {
                text: "❌ Tag/reply user yang ingin dijadikan admin!"
            }, { quoted: msg.raw });
        }

        try {
            await sock.groupParticipantsUpdate(msg.chatId, [target], 'promote');
            await sock.sendMessage(msg.chatId, {
                text: `✅ Berhasil menjadikan @${target.split('@')[0]} sebagai admin`,
                mentions: [target]
            }, { quoted: msg.raw });
        } catch (e) {
            await sock.sendMessage(msg.chatId, {
                text: `❌ Gagal promote: ${e.message}`
            }, { quoted: msg.raw });
        }
    }
};