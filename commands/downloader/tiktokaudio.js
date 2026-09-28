const { scrape } = require('../../lib/scraper/tiktok');
const { getBuffer } = require('../../lib/myFunction');

module.exports = {
    name: "ttmp3",
    alias: ["tiktokaudio", "ttaudio"],
    category: "downloader",
    description: "Download hanya audio dari video TikTok",
    ownerOnly: false,
    groupOnly: false,
    execute: async (sock, msg, args, ctx) => {
        const url = args[0];

        if (!url || !url.includes('tiktok.com')) {
            return sock.sendMessage(msg.chatId, {
                text: `❌ Masukkan link TikTok yang valid!\n\nContoh:\n*${ctx.prefix}ttmp3 https://vt.tiktok.com/xxxxx*`
            }, { quoted: msg.raw });
        }

        await sock.sendMessage(msg.chatId, {
            text: "⏳ Sedang mengambil audio, mohon tunggu..."
        }, { quoted: msg.raw });

        try {
            const response = await scrape(url);

            if (!response.status) {
                return sock.sendMessage(msg.chatId, {
                    text: `❌ Gagal: ${response.message}`
                }, { quoted: msg.raw });
            }

            const musicData = response.result.downloads.find(d => d.type === 'music');

            if (!musicData) {
                return sock.sendMessage(msg.chatId, {
                    text: "❌ Audio tidak ditemukan pada video ini."
                }, { quoted: msg.raw });
            }

            const audioBuffer = await getBuffer(musicData.url);

            if (!audioBuffer) {
                return sock.sendMessage(msg.chatId, {
                    text: "❌ Gagal mengunduh audio."
                }, { quoted: msg.raw });
            }

            await sock.sendMessage(msg.chatId, {
                audio: audioBuffer,
                mimetype: 'audio/mpeg',
                ptt: false,
                fileName: `${response.result.title.slice(0, 30)}.mp3`
            }, { quoted: msg.raw });

        } catch (error) {
            await sock.sendMessage(msg.chatId, {
                text: `❌ Error: ${error.message}`
            }, { quoted: msg.raw });
        }
    }
};