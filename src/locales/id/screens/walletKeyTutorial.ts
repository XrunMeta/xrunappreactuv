export default {
  page1: {
    title: 'Kunci Dompet Milik Anda',
    body: [
      'Dompet xrun Anda memiliki Private Key yang hanya Anda miliki.',
      'Kunci ini adalah satu-satunya bukti kepemilikan dompet. Tidak seperti kata sandi, kunci ini tidak dapat diubah — kunci itu sendiri adalah aset Anda.',
      'Siapa pun yang memegang kunci ini adalah pemilik dompet.',
    ],
  },
  page2: {
    title: 'Cadangkan Kunci Anda dengan Aman',
    body: [
      'Anda dapat mencadangkan kunci dompet di aplikasi. Bahkan jika perangkat hilang atau aplikasi dihapus, cadangan memungkinkan Anda memulihkan dompet.',
      'Cadangan terenkripsi: dikunci dengan PIN untuk keamanan — direkomendasikan',
      'Cadangan polos: siapa pun dapat membukanya, jangan pernah dibagikan',
      'Jika Anda kehilangan file cadangan dan PIN, tidak ada yang dapat memulihkannya. Simpan di tempat yang aman dan terpisah.',
    ],
  },
  page3: {
    title: 'Apa yang Diketahui dan Tidak Diketahui Perusahaan',
    body: [
      'xrun hanya mengetahui alamat dompet Anda. Private key Anda tidak pernah disimpan di server perusahaan.',
      'Namun, karena sifat blockchain, semua transaksi yang dilakukan dengan alamat tersebut dapat dilihat oleh siapa pun (termasuk perusahaan). Ini adalah esensi dari buku besar publik.',
      'Jika Anda kehilangan kunci, perusahaan pun tidak dapat memulihkannya. Tanggung jawab akhir pengelolaan kunci ada pada Anda.',
    ],
  },
  rememberHeading: 'Harap diingat',
  agree: { label: 'Saya telah membaca dan memahami semua hal di atas.' },
  button: { prev: 'Kembali', next: 'Berikutnya', start: 'Mulai' },
  readonly: { close: 'Tutup' },
};
