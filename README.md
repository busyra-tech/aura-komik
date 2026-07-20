# Rakkomik — Template Web Baca Komik (Next.js)

Template platform baca komik (manga/manhwa/manhua) dibangun dengan **Next.js 16 (App Router) + TypeScript + Tailwind CSS v4**.

⚠️ **Penting soal konten:** semua judul, sinopsis, dan "sampul" (warna solid) di `src/lib/data.ts`
adalah data contoh yang saya buat sendiri untuk keperluan pengembangan — bukan hasil scraping dari
situs manapun. Halaman komik pada reader juga masih placeholder (`Halaman N — sambungkan ke sumber
gambar kamu`). Untuk konten produksi, sambungkan ke:
- Database/CMS kamu sendiri, atau
- Sumber gambar yang kamu punya hak untuk mendistribusikan

Jangan gunakan template ini untuk memajang ulang komik berhak cipta tanpa izin dari pemegang haknya.

## Fitur yang sudah ada

- **Beranda** — hero rilisan terbaru, chip genre, grid "Terpopuler" & "Update Terbaru"
- **/daftar-komik** — daftar semua komik, filter genre, sort populer/terbaru
- **/komik/[slug]** — halaman detail: sinopsis, rating, genre, daftar chapter
- **/komik/[slug]/baca/[chapter]** — halaman reader dengan navigasi chapter sebelumnya/selanjutnya
- **/cari?q=** — pencarian judul
- Desain dark theme bertema "halftone/screentone" ala cetakan manga, kartu komik dengan sudut terpotong diagonal

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka http://localhost:3000

## Struktur penting

```
src/
  app/
    page.tsx                     # Beranda
    daftar-komik/page.tsx        # Daftar & filter genre
    cari/page.tsx                # Pencarian
    komik/[slug]/page.tsx        # Detail komik
    komik/[slug]/baca/[chapter]/page.tsx  # Reader
  components/
    Navbar.tsx
    Footer.tsx
    ComicCard.tsx
  lib/
    data.ts     # Sumber data contoh — GANTI dengan API/database asli kamu
    format.ts   # Helper format angka & tanggal
  types/
    komik.ts    # Tipe data Komik & Chapter
```

## Menghubungkan ke data/API asli

Ganti isi fungsi-fungsi di `src/lib/data.ts` (`getAllKomik`, `getKomikBySlug`, `getChapter`, dst.)
agar mengambil data dari database (MySQL/PostgreSQL) atau REST/GraphQL API kamu, alih-alih array
statis. Karena Laravel/AdonisJS sudah jadi stack API kamu, opsi paling mudah: expose endpoint JSON
dari backend tersebut lalu `fetch()` di sini.

Untuk gambar chapter sungguhan, ganti blok placeholder di halaman reader dengan `<Image>` dari
`next/image`, dan simpan URL gambar per halaman di model `Chapter`.

## Catatan font

Untuk menjaga template ini bisa langsung `build` tanpa akses internet, font memakai system font
stack (lihat `src/app/globals.css`). Kalau kamu mau tipografi ala judul manga yang lebih tebal,
bisa ganti ke `next/font/google` misalnya `Bebas Neue` (display) + `Plus Jakarta Sans` (body) —
kode contohnya sudah pernah dipakai sebelumnya di riwayat proyek ini, tinggal aktifkan lagi di
`layout.tsx` saat kamu build di lingkungan yang punya akses ke fonts.googleapis.com.
