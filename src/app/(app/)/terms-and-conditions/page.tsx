import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan - zyho',
  description: 'Syarat dan ketentuan untuk pembelian di zyho.store',
}

export default function TermsAndConditionsPage() {
  return (
    <article className="container mx-auto max-w-4xl py-12 px-4">
      <h1 className="mb-8 text-3xl font-bold">Syarat & Ketentuan</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <p className="lead">
          Selamat datang di zyho.store. Dengan mengakses dan menggunakan layanan kami, Anda setuju untuk terikat oleh Syarat & Ketentuan berikut.
        </p>

        <h2>1. Ketentuan Umum</h2>
        <p>
          Dengan melakukan pembelian di situs kami, Anda menyatakan bahwa Anda telah membaca, memahami, dan setuju untuk terikat oleh Syarat & Ketentuan ini.
        </p>

        <h2>2. Pembelian dan Pembayaran</h2>
        <p>
          <strong>Segala bentuk pembelian dan uang yang sudah dibayar tidak dapat dikembalikan (non-refundable).</strong> 
          Kami sarankan Anda untuk memastikan bahwa produk yang Anda beli sesuai dengan kebutuhan Anda sebelum melakukan pembayaran.
        </p>
        <p>
          Pembayaran yang telah dilakukan dianggap sebagai persetujuan final untuk pembelian produk. 
          Kami tidak menyediakan kebijakan pengembalian dana (refund) untuk pembelian yang sudah selesai.
        </p>

        <h2>3. Pengiriman Produk Digital</h2>
        <p>
          Semua produk yang dijual di zyho.store adalah produk digital (akun, lisensi, file, dll). 
          Produk akan dikirimkan melalui email atau WhatsApp yang Anda daftarkan saat checkout.
        </p>
        <p>
          Waktu pengiriman tergantung pada ketersediaan stok dan jenis produk. Kami akan berusaha untuk mengirimkan secepat mungkin.
        </p>

        <h2>4. Tanggung Jawab Pembeli</h2>
        <p>
          Pembeli bertanggung jawab penuh atas penggunaan produk yang dibeli. 
          Kami tidak bertanggung jawab atas penyalahgunaan, pelanggaran hak cipta, atau masalah hukum lainnya yang timbul dari penggunaan produk.
        </p>

        <h2>5. Hak dan Kewajiban</h2>
        <p>
          Kami berhak untuk:
        </p>
        <ul>
          <li>Menolak atau membatalkan pesanan jika ditemukan kecurangan</li>
          <li>Mengubah harga produk tanpa pemberitahuan terlebih dahulu</li>
          <li>Menghentikan layanan sementara untuk perbaikan atau pemeliharaan</li>
        </ul>

        <h2>6. Kebijakan Privasi</h2>
        <p>
          Informasi pribadi Anda akan dilindungi sesuai dengan <Link href="/privacy-policy" className="underline">Kebijakan Privasi</Link> kami.
        </p>

        <h2>7. Perubahan Syarat & Ketentuan</h2>
        <p>
          Kami berhak untuk memperbarui Syarat & Ketentuan ini dari waktu ke waktu. 
          Perubahan akan efektif segera setelah diposting di halaman ini.
        </p>

        <h2>8. Hukum yang Berlaku</h2>
        <p>
          Syarat & Ketentuan ini diatur dan ditafsirkan sesuai dengan hukum yang berlaku di Republik Indonesia.
        </p>

        <h2>9. Kontak Kami</h2>
        <p>
          Jika Anda memiliki pertanyaan tentang Syarat & Ketentuan ini, silakan hubungi kami.
        </p>
      </div>
    </article>
  )
}
