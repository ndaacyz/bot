const fs = require('fs');
const path = require('path');

module.exports = {
    name: "aiconfig",
    alias: ["setaiprompt"],
    category: "ai",
    description: "Ubah system prompt AI (owner only)",
    ownerOnly: true,
    groupOnly: false,
    execute: async (sock, msg, args, ctx) => {
        const newPrompt = args.join(" ");

        if (!newPrompt) {
            return sock.sendMessage(msg.chatId, {
                text: `❌ Masukkan system prompt baru!\n\nPrompt saat ini:\n"${ctx.config.ai.systemPrompt}"`
            }, { quoted: msg.raw });
        }

        // Update di memory (untuk sementara, sampai bot restart)
        ctx.config.ai.systemPrompt = newPrompt;

        await sock.sendMessage(msg.chatId, {
            text: `✅ System prompt berhasil diubah menjadi:\n"${newPrompt}"\n\n⚠️ Perubahan ini bersifat sementara. Untuk permanen, edit langsung di config.js`
        }, { quoted: msg.raw });
    }
};