module.exports = {
    name: "broadcast",
    alias: ["bc"],
    category: "owner",
    description: "Kirim pesan ke semua user (broadcast)",
    ownerOnly: true,
    groupOnly: false,
    execute: async (sock, msg, args, ctx) => {
        const { db } = ctx;
        const text = args.join(" ");

        if (!text) {
            return sock.sendMessage(msg.chatId, {
                text: "❌ Masukkan pesan yang ingin di-broadcast!\nContoh: .broadcast Halo semua"
            }, { quoted: msg.raw });
        }

        const users = db.getAllUsers();
        const userIds = Object.keys(users);

        await sock.sendMessage(msg.chatId, {
            text: `📢 Memulai broadcast ke ${userIds.length} user...`
        }, { quoted: msg.raw });

        let success = 0;
        let failed = 0;

        for (const userId of userIds) {
            try {
                await sock.sendMessage(userId, {
                    text: `📢 *BROADCAST*\n\n${text}`
                });
                success++;
                await new Promise((resolve) => setTimeout(resolve, 500)); // delay anti-spam
            } catch (e) {
                failed++;
            }
        }

        await sock.sendMessage(msg.chatId, {
            text: `✅ Broadcast selesai!\nBerhasil: ${success}\nGagal: ${failed}`
        }, { quoted: msg.raw });
    }
};