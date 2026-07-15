import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kebijakan Privasi - zyho',
  description: 'Kebijakan privasi untuk layanan zyho.store',
}

export default function PrivacyPolicyPage() {
  return (
    <article className="container mx-auto max-w-4xl py-12 px-4">
      <h1 className="mb-8 text-3xl font-bold">Kebijakan Privasi</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <p className="lead">
          Terima kasih telah menggunakan layanan kami. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda.
        </p>

        <h2>1. Informasi yang Kami Kumpulkan</h2>
        <p>
          Kami dapat mengumpulkan informasi pribadi yang Anda berikan secara langsung, seperti nama, alamat email, nomor telepon, dan informasi pembayaran saat Anda mendaftar, melakukan pembelian, atau menghubungi kami.
        </p>

        <h2>2. Penggunaan Informasi</h2>
        <p>
          Informasi yang kami kumpulkan digunakan untuk:
        </p>
        <ul>
          <li>Memproses dan mengirimkan pesanan Anda</li>
          <li>Memberikan layanan pelanggan</li>
          <li>Mengirimkan informasi promosi (jika Anda setuju)</li>
          <li>Meningkatkan layanan dan pengalaman pengguna</li>
        </ul>

        <h2>3. Perlindungan Data</h2>
        <p>
          Kami menerapkan langkah-langkah keamanan yang sesuai untuk melindungi informasi pribadi Anda dari akses, penggunaan, atau pengungkapan yang tidak sah.
        </p>

        <h2>4. Pembagian Informasi</h2>
        <p>
          Kami tidak menjual, menukar, atau menyewakan informasi pribadi Anda kepada pihak ketiga. Informasi Anda hanya akan dibagikan dengan pihak ketiga tepercaya yang membantu kami dalam mengoperasikan situs web atau melayani Anda, dengan syarat pihak tersebut setuju untuk menjaga kerahasiaan informasi tersebut.
        </p>

        <h2>5. Cookie</h2>
        <p>
          Kami menggunakan cookie untuk meningkatkan pengalaman Anda di situs web kami. Anda dapat memilih untuk menonaktifkan cookie melalui pengaturan browser Anda.
        </p>

        <h2>6. Perubahan Kebijakan Privasi</h2>
        <p>
          Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan akan diposting di halaman ini dengan tanggal efektif yang tertera.
        </p>

        <h2>7. Kontak Kami</h2>
        <p>
          Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami.
        </p>
      </div>
    </article>
  )
}
