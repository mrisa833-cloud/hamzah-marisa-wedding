/* EDIT SELURUH DETAIL ACARA DI FILE INI */
window.WEDDING_CONFIG = {
  couple: {
    groom: "Hamzah, S. A. P", bride: "Marisa, S. Pd",
    groomFather: "Efendi", groomMother: "Nida Wati",
    brideFather: "Warni", brideMother: "Linda"
  },
  venue: {
    name: "Di Rumah Mempelai Wanita",
    address: "Jl. H. Ismail Desa Sungai Baru Dusun Rasau RT 008/RW 004, Kec. Teluk Keramat, Kab. Sambas",
    mapsUrl: "https://goo.gl/maps/EKjbTX8ebZFvXDkAA"
  },
  events: {
    akad: {
      title: "Akad Nikah Hamzah & Marisa",
      start: "20270319T013000Z",
      // Kalender memerlukan waktu selesai. 09.30 WIB adalah durasi sementara; silakan sesuaikan.
      end: "20270319T023000Z",
      displayDate: "Jumat, 19 Maret 2027", displayTime: "08.30 WIB — selesai",
      description: "Akad Nikah Hamzah & Marisa. Kehadiran dan doa restu Anda merupakan kebahagiaan bagi kami."
    },
    resepsi: {
      title: "Resepsi Pernikahan Hamzah & Marisa",
      start: "20270320T063000Z", end: "20270320T110000Z",
      displayDate: "Sabtu, 20 Maret 2027", displayTime: "13.30–18.00 WIB",
      description: "Resepsi pernikahan Hamzah & Marisa. Kami menantikan kehadiran Anda."
    }
  },
  countdownTarget: "2027-03-19T08:30:00+07:00",
  gift: {
    title: "DANA", number: "082158874278",
    address: "Di Rumah Mempelai Wanita — Jl. H. Ismail Desa Sungai Baru Dusun Rasau RT 008/RW 004, Kec. Teluk Keramat, Kab. Sambas",
    mapsUrl: "https://goo.gl/maps/EKjbTX8ebZFvXDkAA"
  },
  rsvpEndpoint: "", // Isi dengan URL Web App Google Apps Script yang berakhiran /exec.
  refreshWishesMs: 20000,
  musicFile: "" // Opsional: contoh "assets/wedding-music.mp3" (gunakan musik yang Anda miliki izinnya).
};
