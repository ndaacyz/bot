# 🤖 WhatsApp Bot - Baileys

Bot WhatsApp multifungsi yang dibangun menggunakan [@whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys) dengan fitur AI Chat, Downloader Media Sosial, dan sistem manajemen grup yang lengkap.

![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![License](https://img.shields.io/badge/License-MIT-blue)
![Baileys](https://img.shields.io/badge/Baileys-v6.7.9-brightgreen)

---

## 📋 Daftar Isi

- [Fitur](#-fitur)
- [Prasyarat](#-prasyarat)
- [Instalasi](#-instalasi)
- [Konfigurasi](#-konfigurasi)
- [Menjalankan Bot](#-menjalankan-bot)
- [Struktur Project](#-struktur-project)
- [Daftar Command](#-daftar-command)
- [Cara Menambah Command Baru](#-cara-menambah-command-baru)
- [Sistem Database](#-sistem-database)
- [Sistem Permission](#-sistem-permission)
- [Troubleshooting](#-troubleshooting)
- [Kontribusi](#-kontribusi)
- [Lisensi](#-lisensi)

---

## ✨ Fitur

### 🔐 Autentikasi
- Login menggunakan QR Code scan
- Session tersimpan otomatis (tidak perlu scan ulang setiap restart)
- Auto-reconnect jika koneksi terputus

### 🤖 AI Chat
- Chat dengan AI menggunakan Atria API
- Conversation history per user (context-aware)
- Reset history percakapan
- Custom system prompt (owner only)

### 📥 Downloader
- **TikTok**: Download video tanpa watermark + audio
- **Instagram**: Download post, reel, IGTV, dan carousel/slide

### 👑 Sistem Owner
- Broadcast pesan ke semua user
- Ban/unban user dari menggunakan bot
- Restart bot dari chat

### 👥 Manajemen Grup
- Kick, promote, demote member
- Welcome & leave message otomatis
- Info grup lengkap
- Toggle pengaturan grup (welcome message, dll)

### 💾 Database Lokal
- Penyimpanan data user & grup berbasis JSON
- Auto-save berkala
- Tidak memerlukan database server eksternal

### 🛠️ Developer Friendly
- Struktur folder modular & terorganisir
- Command auto-loader (tidak perlu edit file utama)
- Sistem logging dengan warna
- Easy to extend

---

## 📦 Prasyarat

Sebelum instalasi, pastikan sistem Anda sudah memiliki:

| Requirement | Versi Minimum | Keterangan |
|-------------|---------------|------------|
| Node.js | v18.0.0 | [Download di sini](https://nodejs.org/) |
| NPM | v9.0.0 | Terinstall otomatis bersama Node.js |
| WhatsApp | - | Akun WhatsApp aktif untuk di-link |

Cek versi Node.js yang terinstall:
```bash
node -v
npm -v
