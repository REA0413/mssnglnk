export const languages = {
  en: {
    titleLine1: "Jakarta Airport Train Station x Sky Train",
    titleLine2: "Travel Time Estimator",
    subtitle: "This tool checks if your Airport Train schedule allows enough time to take the Sky Train and reach your terminal's Check-In counter.",
    form: {
      expectedTime: {
        label: "Expected Time at Check In Counter (example: 17:50)",
        tooltip: "The time you expect to arrive at the check in counter."
      },
      terminal: {
        label: "CGK Airport Terminal",
        tooltip: "The terminal you will check in at.",
        placeholder: "Select terminal"
      },
      departureStation: {
        label: "Airport Train Departure Station",
        tooltip: "The airport train station you will depart from.",
        placeholder: "Select station"
      },
      departureTime: {
        label: "Airport Train Departure Time",
        tooltip: "The time you expect to depart from the airport train station.",
        placeholder: "Select time"
      },
      buttons: {
        submit: "Can I make it?",
        calculating: "Calculating...",
        reset: "Reset form",
        redisplay: "Redisplay result",
        hideInfo: "Hide information"
      }
    },
    modal: {
      title: "Your Estimated Journey Time",
      skyTrainArrival: "You will arrive at Sky Train Station:",
      skyTrainDeparture: "Your Sky Train will Depart at:",
      terminalArrival: "Your Sky Train will Arrive at:",
      checkInArrival: "You will arrive at Check In Counter at:",
      clickInfo: "If you need further information, please click on all the train images you see on this page"
    },
    welcome: {
      messageTop: "Hiya, hope you find this tool useful!",
      messageBottom: "Remember, the missing link is resolved by mssnglnk :)"
    },
    accordion: {
      accuracy: {
        title: "How is this tool accurate?",
        content: "We take the train schedule from the official website of the airport train and the sky train. We also consider the time needed to walk from the airport train station to the sky train station plus the time needed to walk from the sky train station to the check in counter."
      },
      feedback: {
        title: "Feedback",
        content: "We do really appreciate any feedback or suggestion to improve this tool! Don't hesitate to contact me via email or X if you think the available airport train schedule is inaccurate."
      },
      source: {
        title: "Source of Truth",
        trainAccount: "Official Airport Train Instagram Account:",
        skyTrainWebsite: "Official Sky Train website:",
        skyTrainLink: "Soekarno-Hatta Airport Sky Train"
      },
      booking: {
        title: "How to book a ticket?",
        trainInfo: "The Jakarta Airport Train ticket can be purchased at the airport train station or via",
        trainLink: "this website",
        skyTrainInfo: "The Sky Train ticket is free of charge."
      }
    }
  },
  id: {
    titleLine1: "Kalkulator Waktu Tempuh",
    titleLine2: "Kereta Bandara Jakarta x Kereta Layang Soekarno-Hatta",
    subtitle: "Alat ini memeriksa apakah jadwal Kereta Bandara Anda memberi cukup waktu untuk naik Sky Train dan tiba di konter Check In terminal.",
    form: {
      expectedTime: {
        label: "Mau tiba di konter check in jam berapa? (contoh: 17:50)",
        tooltip: "Waktu yang Anda harapkan untuk tiba di konter check in."
      },
      terminal: {
        label: "Di Terminal mana Anda akan check in?",
        tooltip: "Terminal tempat Anda akan melakukan proses check in.",
        placeholder: "Pilih terminal"
      },
      departureStation: {
        label: "Dari stasiun kereta bandara mana Anda akan berangkat?",
        tooltip: "Stasiun kereta bandara tempat Anda memulai perjalanan.",
        placeholder: "Pilih stasiun"
      },
      departureTime: {
        label: "Jam berapa kereta bandara Anda berangkat?",
        tooltip: "Waktu keberangkatan kereta bandara yang Anda akan beli / sudah beli.",
        placeholder: "Pilih waktu"
      },
      buttons: {
        submit: "Kekejar ngga yah?",
        calculating: "Sebentar, coba kami hitung dulu...",
        reset: "Kosongkan formulir",
        redisplay: "Tampilkan hasil perhitungan",
        hideInfo: "Sembunyikan Informasi"
      }
    },
    modal: {
      title: "Estimasi Waktu Perjalanan Anda",
      skyTrainArrival: "Anda akan tiba di Stasiun Kereta Layang pada pukul:",
      skyTrainDeparture: "Kereta Layang Anda akan berangkat pada pukul:",
      terminalArrival: "Kereta Layang Anda akan tiba pada pukul:",
      checkInArrival: "Anda akan tiba di Konter Check In pada pukul:",
      clickInfo: "Apabila Anda membutuhkan informasi lebih lanjut, silakan klik semua gambar kereta yang Anda lihat di halaman ini"
    },
    welcome: {
      messageTop: "Hiya, hope you find this tool useful!",
      messageBottom: "Remember, the missing link is resolved by mssnglnk :)"
    },
    accordion: {
      accuracy: {
        title: "Bagaimana alat ini akurat?",
        content: "Kami mengambil jadwal kereta dari situs resmi kereta bandara dan kereta layang Soekarno-Hatta. Kami juga mempertimbangkan waktu yang dibutuhkan untuk berjalan dari stasiun kereta bandara ke stasiun kereta layang ditambah waktu yang dibutuhkan untuk berjalan dari stasiun kereta layang ke konter check in."
      },
      feedback: {
        title: "Masukan",
        content: "Kami sangat menghargai setiap masukan atau saran untuk meningkatkan alat ini! Jangan ragu untuk menghubungi saya melalui email atau X jika Anda merasa jadwal kereta bandara yang tersedia tidak akurat."
      },
      source: {
        title: "Sumber Informasi",
        trainAccount: "Akun Instagram Resmi Kereta Bandara:",
        skyTrainWebsite: "Situs resmi Kereta Layang:",
        skyTrainLink: "Kereta Layang Bandara Soekarno-Hatta"
      },
      booking: {
        title: "Cara memesan tiket?",
        trainInfo: "Tiket Kereta Bandara Jakarta dapat dibeli di stasiun kereta bandara atau melalui",
        trainLink: "situs web ini",
        skyTrainInfo: "Tiket Kereta Layang gratis."
      }
    }
  }
};

export type Language = keyof typeof languages; 