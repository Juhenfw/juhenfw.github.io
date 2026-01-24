<div align="right">
  <a href="README.md">🇺🇸 English</a> | 🇮🇩 <strong>Bahasa Indonesia</strong>
</div>

# 🧠 Portofolio Neural Network

> **"Menjembatani pengetahuan akademis dengan inovasi dunia nyata."**

Website portofolio interaktif bertema **Sci-Fi / Cyberpunk** yang mensimulasikan antarmuka "Digital Cortex". Dibangun untuk menampilkan profil, riset, dan proyek teknis menggunakan gaya visual node data yang saling terhubung.

🌐 **Demo Langsung:** [juhenfw.github.io](https://juhenfw.github.io)

![Pratinjau Portofolio Dinamis](preview_web.gif)

---

## ✨ Fitur Utama

* **Jaringan Saraf Interaktif:** Background partikel dinamis menggunakan **P5.js** yang merespons gerakan mouse.
* **Dashboard Satu Halaman:** Antarmuka dashboard imersif tanpa scroll (di desktop) yang terasa seperti aplikasi native atau terminal.
* **Manajemen Data Terpusat:** Seluruh konten (Profil, Pengalaman, Skill) diatur hanya melalui satu file JSON (`mind.json`).
* **UI Glassmorphism:** Desain modern dengan efek kaca buram (blur), batas neon yang menyala, dan tipografi futuristik.
* **Sistem Blog Adaptif:** Sistem blog terpisah yang responsif penuh dengan mode baca yang optimal, tipografi cair (fluid), dan blok kode gaya terminal.
* **Optimasi Seluler:** Tata letak secara otomatis beradaptasi menjadi tampilan kartu yang dapat digulir (scrollable) pada perangkat seluler untuk kemudahan penggunaan.

---

## 🛠️ Stack Teknologi

Dibangun dengan **Teknologi Web Murni (Vanilla)** untuk performa maksimal, tanpa framework berat.

* **HTML5:** Struktur Semantik.
* **CSS3:** Flexbox, Grid, Variabel CSS, Animasi, Media Queries.
* **JavaScript (ES6+):** Manipulasi DOM, Parsing JSON, Logika Sistem.
* **P5.js:** Library Creative Coding untuk sistem partikel background.
* **Font Awesome:** Ikon Vektor.
* **Google Fonts:** 'Space Grotesk' & 'JetBrains Mono'.

---

## 📂 Struktur Proyek

Memahami struktur folder adalah kunci untuk mengelola website ini:

```plaintext
juhenfw.github.io/
│
├── index.html          # Dashboard Utama (Inti Sistem)
├── style.css           # Gaya & Variabel Global (Tema Cyberpunk)
│
├── assets/             # Aset Gambar (Profil, Logo, Screenshot)
│
├── data/
│   └── mind.json       # 🧠 OTAK/BRAIN (Edit semua teks konten di sini)
│
├── js/
│   ├── brain.js        # Logika Sistem (Parsing JSON, Event Listeners)
│   └── sketch.js       # Visual Inti (Sistem Partikel P5.js)
│
└── blog/               # Sistem Blog Terpisah
    ├── template.html   # Template Master untuk membuat artikel baru
    ├── blog-style.css  # CSS Khusus untuk mode baca
    └── article-01.html # Contoh file artikel
```

---

## 🚀 Instalasi & Penggunaan

Ikuti langkah-langkah ini untuk menjalankan website di komputer lokal Anda:

### 1. Clone Repositori
```bash
git clone [https://github.com/juhenfw/juhenfw.github.io.git](https://github.com/juhenfw/juhenfw.github.io.git)
cd juhenfw.github.io
```

### 2. Jalankan Server Lokal
Karena website ini mengambil file JSON eksternal (`mind.json`), Anda **tidak bisa** hanya mengklik ganda `index.html`. Anda memerlukan server lokal untuk menghindari error CORS.

* **Menggunakan VS Code (Disarankan):**
    1.  Install ekstensi **"Live Server"**.
    2.  Klik kanan pada `index.html`.
    3.  Pilih **"Open with Live Server"**.

* **Menggunakan Python:**
    ```bash
    # Jalankan perintah ini di dalam folder proyek
    python -m http.server 8000
    ```
    Lalu buka `http://localhost:8000` di browser Anda.

---

## ⚙️ Panduan Kustomisasi

### Langkah 1: Identitas & Branding
Ganti gambar default di folder `assets/`:
* `profile.webp`: Foto profil Anda (Disarankan rasio 1:1, maks 400px).
* `logo.png`: Ikon favicon situs Anda.

### Langkah 2: Manajemen Konten (The Mind)
Buka file **`data/mind.json`**. Ini adalah satu-satunya sumber data. Anda tidak perlu menyentuh HTML untuk memperbarui pengalaman atau skill Anda.

**Contoh Struktur Data:**
```json
{
  "profile": {
    "name": "Nama Anda",
    "role": "Pekerjaan/Jabatan",
    "tagline": "Bio singkat Anda..."
  },
  "nodes": [
    {
      "id": "exp-perusahaan-a",
      "type": "experience",  // Pilihan: experience, research, project, skill
      "title": "Software Engineer",
      "priority": 9          // 9-10 = Selalu tampil, <8 = Diacak
    }
  ]
}
```

### Langkah 3: Menulis Artikel Blog Baru
1.  Masuk ke folder `blog/`.
2.  Duplikat file `template.html`.
3.  Ubah namanya (misal: `proyek-baru-saya.html`).
4.  Edit konten HTML-nya. Template sudah mendukung:
    * `<pre><code>` untuk blok kode gaya terminal.
    * `<div class="table-wrapper">` untuk tabel data responsif.
    * `<div class="video-container">` untuk embed YouTube.
5.  Daftarkan artikel baru tersebut di `data/mind.json` dengan tipe `"type": "blog"`.

---

## 🎨 Palet Warna (Variabel CSS)

Anda dapat dengan mudah mengubah tema warna dengan mengedit variabel `:root` di `style.css`:

```css
:root {
    --primary-color: #00ffc8;    /* Warna Utama Neon Cyan */
    --secondary-color: #aa00ff;  /* Warna Aksen Neon Ungu */
    --bg-color: #05080c;         /* Background Gelap Pekat */
}
```

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Jika Anda menemukan bug atau ingin menambahkan fitur:
1.  Fork repositori ini.
2.  Buat branch fitur baru (`git checkout -b nama-fitur`).
3.  Commit perubahan Anda.
4.  Push ke branch tersebut.
5.  Buat Pull Request.

---

## 📄 Lisensi

Didistribusikan di bawah **Lisensi MIT**. Silakan gunakan, modifikasi, dan distribusikan ulang untuk proyek pribadi atau komersial. Atribusi sangat dihargai namun tidak diwajibkan.

---

<p align="center">
  Dibuat dengan 💻 dan ☕ oleh <strong>Juhen Fashikha Wildan</strong>
</p>
