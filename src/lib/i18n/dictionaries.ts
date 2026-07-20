export const dictionaries = {
  id: {
    navbar: {
      home: "Beranda",
      search: "Cari",
      bookmarks: "Pustaka",
      searchPlaceholder: "Cari judul komik…"
    },
    home: {
      recommendation: "REKOMENDASI",
      latestUpdate: "UPDATE TERBARU",
      seeAll: "Lihat semua →",
      noChapter: "Belum ada chapter"
    },
    detail: {
      synopsis: "Sinopsis",
      chapters: "Chapter",
      chapterList: "Daftar Chapter",
      status: "Status",
      type: "Tipe",
      author: "Author",
      rating: "Rating",
      views: "Views",
      updated: "Diperbarui",
      readFirst: "Baca Chapter Pertama",
      readLatest: "Baca Chapter Terbaru",
      newest: "Terbaru",
      oldest: "Terlama"
    },
    reader: {
      list: "Daftar",
      settings: "Pengaturan",
      next: "Next",
      prev: "Prev",
      autoScrollSpeed: "Kecepatan Autoscroll",
      save: "Simpan",
      later: "Nanti",
      back: "Kembali",
      chooseChapter: "PILIH CHAPTER",
      reading: "Sedang dibaca"
    },
    common: {
      timeMins: "mnt",
      timeHours: "jam",
      timeDays: "hari",
      timeWeeks: "mgg",
      timeMonths: "bln",
      timeYears: "thn"
    }
  },
  en: {
    navbar: {
      home: "Home",
      search: "Search",
      bookmarks: "Library",
      searchPlaceholder: "Search comics…"
    },
    home: {
      recommendation: "RECOMMENDATION",
      latestUpdate: "LATEST UPDATES",
      seeAll: "See all →",
      noChapter: "No chapters yet"
    },
    detail: {
      synopsis: "Synopsis",
      chapters: "Chapters",
      chapterList: "Chapter List",
      status: "Status",
      type: "Type",
      author: "Author",
      rating: "Rating",
      views: "Views",
      updated: "Updated",
      readFirst: "Read First Chapter",
      readLatest: "Read Latest Chapter",
      newest: "Newest",
      oldest: "Oldest"
    },
    reader: {
      list: "List",
      settings: "Settings",
      next: "Next",
      prev: "Prev",
      autoScrollSpeed: "Autoscroll Speed",
      save: "Save",
      later: "Later",
      back: "Back",
      chooseChapter: "CHOOSE CHAPTER",
      reading: "Reading"
    },
    common: {
      timeMins: "mins",
      timeHours: "hrs",
      timeDays: "days",
      timeWeeks: "wks",
      timeMonths: "mos",
      timeYears: "yrs"
    }
  }
};

export type Dictionary = typeof dictionaries.id;
