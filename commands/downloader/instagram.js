const { scrape } = require('../../lib/scraper/instagram');
const { getBuffer } = require('../../lib/myFunction');

module.exports = {
    name: "instagram",
    alias: ["ig", "igdl", "instagramdl"],
    category: "downloader",
    description: "Download video/foto/reel Instagram",
    ownerOnly: false,
    groupOnly: false,
    execute: async (sock, msg, args, ctx) => {
        const url = args[0];

        // Validasi input URL
        if (!url) {
            return sock.sendMessage(msg.chatId, {
                text: `❌ Masukkan link Instagram!\n\nContoh:\n*${ctx.prefix}instagram https://www.instagram.com/p/xxxxx*\n\nMendukung: Post, Reel, IGTV, Carousel`
            }, { quoted: msg.raw });
        }

        if (!url.includes('instagram.com')) {
            return sock.sendMessage(msg.chatId, {
                text: "❌ Link tidak valid! Pastikan itu adalah link Instagram."
            }, { quoted: msg.raw });
        }

        // Kirim pesan loading
        await sock.sendMessage(msg.chatId, {
            text: "⏳ Sedang memproses media Instagram, mohon tunggu..."
        }, { quoted: msg.raw });

        try {
            const response = await scrape(url);

            if (!response.status) {
                return sock.sendMessage(msg.chatId, {
                    text: `❌ Gagal mengambil data Instagram!\n\nError: ${response.message}\n\n💡 Tips: Pastikan post/reel bersifat publik (tidak private).`
                }, { quoted: msg.raw });
            }

            const { title, downloads, type } = response.result;

            const caption = `╭───「 *INSTAGRAM DOWNLOADER* 」───╮
│ 📝 ${title.length > 50 ? title.slice(0, 50) + '...' : title}
│ 📦 Total Media: ${downloads.length}
╰──────────────────────────╯`;

            // Filter berdasarkan tipe
            const videos = downloads.filter(d => d.type === 'video');
            const photos = downloads.filter(d => d.type === 'photo');

            // ==== Kasus 1: Hanya ada satu media (video atau photo tunggal) ====
            if (downloads.length === 1) {
                const media = downloads[0];
                const buffer = await getBuffer(media.url);

                if (!buffer) {
                    return sock.sendMessage(msg.chatId, {
                        text: "❌ Gagal mengunduh media. Coba lagi nanti."
                    }, { quoted: msg.raw });
                }

                if (media.type === 'video') {
                    await sock.sendMessage(msg.chatId, {
                        video: buffer,
                        caption: caption,
                        mimetype: 'video/mp4'
                    }, { quoted: msg.raw });
                } else {
                    await sock.sendMessage(msg.chatId, {
                        image: buffer,
                        caption: caption
                    }, { quoted: msg.raw });
                }
                return;
            }

            // ==== Kasus 2: Multiple media (carousel/slide) ====
            await sock.sendMessage(msg.chatId, {
                text: `${caption}\n\n🎬 Video: ${videos.length} | 📸 Foto: ${photos.length}`
            }, { quoted: msg.raw });

            // Kirim video-video terlebih dahulu
            for (let i = 0; i < videos.length; i++) {
                const buffer = await getBuffer(videos[i].url);
                if (buffer) {
                    await sock.sendMessage(msg.chatId, {
                        video: buffer,
                        caption: `🎬 Video ${i + 1}/${videos.length}`,
                        mimetype: 'video/mp4'
                    });
                }
                await new Promise(resolve => setTimeout(resolve, 800));
            }

            // Kirim foto-foto setelahnya
            for (let i = 0; i < photos.length; i++) {
                const buffer = await getBuffer(photos[i].url);
                if (buffer) {
                    await sock.sendMessage(msg.chatId, {
                        image: buffer,
                        caption: `📸 Foto ${i + 1}/${photos.length}`
                    });
                }
                await new Promise(resolve => setTimeout(resolve, 800));
            }

        } catch (error) {
            console.error("Error command instagram:", error);
            await sock.sendMessage(msg.chatId, {
                text: `❌ Terjadi kesalahan saat memproses Instagram:\n${error.message}`
            }, { quoted: msg.raw });
        }
    }
};