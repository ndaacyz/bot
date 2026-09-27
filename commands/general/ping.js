module.exports = {
    name: "ping",
    alias: ["p"],
    category: "general",
    description: "Cek kecepatan respon bot",
    ownerOnly: false,
    groupOnly: false,
    execute: async (sock, msg, args, ctx) => {
        const start = Date.now();
        const sent = await sock.sendMessage(msg.chatId, {
            text: "🏓 Pinging..."
        }, { quoted: msg.raw });

        const latency = Date.now() - start;

        await sock.sendMessage(msg.chatId, {
            text: `🏓 *Pong!*\n⏱️ Latency: ${latency}ms`,
            edit: sent.key
        }).catch(async () => {
            // fallback jika edit tidak didukung
            await sock.sendMessage(msg.chatId, {
                text: `🏓 *Pong!*\n⏱️ Latency: ${latency}ms`
            }, { quoted: msg.raw });
        });
    }
};