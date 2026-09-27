module.exports = {
    name: "setwelcome",
    alias: [],
    category: "group",
    description: "Toggle welcome message on/off",
    ownerOnly: false,
    groupOnly: true,
    adminOnly: true,
    execute: async (sock, msg, args, ctx) => {
        const { groupData, db } = ctx;
        const newStatus = !groupData.welcome;

        db.setGroup(msg.chatId, { welcome: newStatus });

        await sock.sendMessage(msg.chatId, {
            text: `✅ Welcome message sekarang: ${newStatus ? "ON" : "OFF"}`
        }, { quoted: msg.raw });
    }
};