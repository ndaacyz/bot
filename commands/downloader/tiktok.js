const { scrape } = require('../../lib/scraper/tiktok');
const { getBuffer } = require('../../lib/myFunction');

module.exports = {
    name: "tiktok",
    alias: ["tt", "ttdl", "tiktokdl"],
    category: "downloader",
    description: "Download video/foto TikTok tanpa watermark",
    ownerOnly: false,
    groupOnly: false,
    execute: async (sock, msg, args, ctx) => {
        const url = args[0];

        // Validasi input URL
        if (!url) {
            return sock.sendMessage(msg.chatId, {
                text: `❌ Masukkan link TikTok!\n\nContoh:\n*${ctx.prefix}tiktok https://vt.tiktok.com/xxxxx*`
            }, { quoted: msg.raw });
        }

        if (!url.includes('tiktok.com')) {
            return sock.sendMessage(msg.chatId, {
                text: "❌ Link tidak valid! Pastikan itu adalah link TikTok."
            }, { quoted: msg.raw });
        }

        // Kirim pesan loading
        await sock.sendMessage(msg.chatId, {
            text: "⏳ Sedang memproses video TikTok, mohon tunggu..."
        }, { quoted: msg.raw });

        try {
            const response = await scrape(url);

            if (!response.status) {
                return sock.sendMessage(msg.chatId, {
                    text: `❌ Gagal mengambil data TikTok!\n\nError: ${response.message}`
                }, { quoted: msg.raw });
            }

            const { title, author, type, downloads } = response.result;

            const caption = `╭───「 *TIKTOK DOWNLOADER* 」───╮
│ 📝 Judul: ${title}
│ 👤 Author: ${author}
│ 📦 Tipe: ${type === 'photo' ? 'Slide Foto' : 'Video'}
╰────────────────────────╯`;

            // ==== Handle TIPE VIDEO ====
            if (type === 'video') {
                const videoData = downloads.find(d => d.type === 'video');
                const musicData = downloads.find(d => d.type === 'music');

                if (!videoData) {
                    return sock.sendMessage(msg.chatId, {
                        text: "❌ Video tidak ditemukan, mungkin link tidak valid atau video bersifat private."
                    }, { quoted: msg.raw });
                }

                const videoBuffer = await getBuffer(videoData.url);

                if (!videoBuffer) {
                    return sock.sendMessage(msg.chatId, {
                        text: "❌ Gagal mengunduh video. Coba lagi nanti."
                    }, { quoted: msg.raw });
                }

                await sock.sendMessage(msg.chatId, {
                    video: videoBuffer,
                    caption: caption,
                    mimetype: 'video/mp4'
                }, { quoted: msg.raw });

                // Kirim musik terpisah jika tersedia
                if (musicData) {
                    const musicBuffer = await getBuffer(musicData.url);
                    if (musicBuffer) {
                        await sock.sendMessage(msg.chatId, {
                            audio: musicBuffer,
                            mimetype: 'audio/mpeg',
                            ptt: false
                        }, { quoted: msg.raw });
                    }
                }
            }

            // ==== Handle TIPE PHOTO/SLIDE ====
            else if (type === 'photo') {
                const photos = downloads.filter(d => d.type === 'photo');
                const musicData = downloads.find(d => d.type === 'music');

                if (photos.length === 0) {
                    return sock.sendMessage(msg.chatId, {
                        text: "❌ Foto tidak ditemukan dalam slide ini."
                    }, { quoted: msg.raw });
                }

                // Kirim info dulu
                await sock.sendMessage(msg.chatId, {
                    text: `${caption}\n\n📸 Total: ${photos.length} foto`
                }, { quoted: msg.raw });

                // Kirim setiap foto secara berurutan
                for (let i = 0; i < photos.length; i++) {
                    const photoBuffer = await getBuffer(photos[i].url);
                    if (photoBuffer) {
                        await sock.sendMessage(msg.chatId, {
                            image: photoBuffer,
                            caption: i === 0 ? `📸 Foto ${i + 1}/${photos.length}` : `📸 Foto ${i + 1}/${photos.length}`
                        });
                    }
                    // Delay kecil biar tidak spam/rate limit
                    await new Promise(resolve => setTimeout(resolve, 800));
                }

                // Kirim musik jika tersedia
                if (musicData) {
                    const musicBuffer = await getBuffer(musicData.url);
                    if (musicBuffer) {
                        await sock.sendMessage(msg.chatId, {
                            audio: musicBuffer,
                            mimetype: 'audio/mpeg',
                            ptt: false
                        });
                    }
                }
            }

        } catch (error) {
            console.error("Error command tiktok:", error);
            await sock.sendMessage(msg.chatId, {
                text: `❌ Terjadi kesalahan saat memproses TikTok:\n${error.message}`
            }, { quoted: msg.raw });
        }
    }
};