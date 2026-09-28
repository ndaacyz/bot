const { generateResponse, updateHistory } = require('../../lib/aiManager');

module.exports = {
    name: "ai",
    alias: ["chat", "gpt", "tanya"],
    category: "ai",
    description: "Chat dengan AI (Atria)",
    ownerOnly: false,
    groupOnly: false,
    execute: async (sock, msg, args, ctx) => {
        const { userData, db, sender } = ctx;
        const userInput = args.join(" ");

        if (!userInput) {
            return sock.sendMessage(msg.chatId, {
                text: `❌ Masukkan pertanyaan!\n\nContoh: *${ctx.prefix}ai apa itu blockchain?*`
            }, { quoted: msg.raw });
        }

        // Kirim indikator "typing..."
        await sock.sendPresenceUpdate('composing', msg.chatId);

        // Ambil history percakapan user (default array kosong jika belum ada)
        const history = userData.aiHistory || [];

        // Generate response dari AI
        const result = await generateResponse(userInput, history);

        // Update history jika request berhasil
        if (!result.error) {
            const newHistory = updateHistory(history, userInput, result.text);
            db.setUser(sender, { aiHistory: newHistory });
        }

        // Hentikan indikator typing
        await sock.sendPresenceUpdate('paused', msg.chatId);

        // Kirim response ke user
        await sock.sendMessage(msg.chatId, {
            text: result.text
        }, { quoted: msg.raw });
    }
};