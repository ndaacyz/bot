module.exports = {
    name: "kick",
    alias: ["tendang"],
    category: "group",
    description: "Kick member dari grup",
    ownerOnly: false,
    groupOnly: true,
    adminOnly: true,
    botAdminRequired: true,
    execute: async (sock, msg, args, ctx) => {
        const target = ctx.extractTarget(msg, args);

        if (!target) {
            return sock.sendMessage(msg.chatId, {
                text: "❌ Tag/reply user yang ingin di-kick!"
            }, { quoted: msg.raw });
        }

        try {
            await sock.groupParticipantsUpdate(msg.chatId, [target], 'remove');
            await sock.sendMessage(msg.chatId, {
                text: `✅ Berhasil kick @${target.split('@')[0]}`,
                mentions: [target]
            }, { quoted: msg.raw });
        } catch (e) {
            await sock.sendMessage(msg.chatId, {
                text: `❌ Gagal kick: ${e.message}`
            }, { quoted: msg.raw });
        }
    }
};