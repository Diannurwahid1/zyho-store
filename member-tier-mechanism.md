# Member Tier Mechanism

## Ringkasan

Sistem member memakai akumulasi `totalSpentIDR` dari order yang sudah berstatus `completed`.
Tier user dihitung ulang setiap ada perubahan atau penghapusan order.

Perhitungan ini dipakai untuk:

- menentukan tier member aktif
- menentukan progress ke tier berikutnya
- menentukan voucher mana yang berhak dipakai user

## Sumber Nilai Transaksi

Nilai yang dihitung adalah field `amount` pada collection `orders`.

Aturan penting:

- hanya order dengan `status = completed` yang masuk perhitungan
- order `processing`, `cancelled`, dan `refunded` tidak dihitung
- jika order memakai voucher, yang dihitung tetap `amount` final setelah diskon

## Rumus Total Belanja

`totalSpentIDR = sum(order.amount)` untuk semua order user dengan status `completed`.

Contoh:

- Order 1: `Rp150.000`
- Order 2: `Rp100.000`
- Order 3: `Rp400.000`

Maka:

`totalSpentIDR = 150.000 + 100.000 + 400.000 = Rp650.000`

## Aturan Tier

Tier ditentukan dari `totalSpentIDR` dengan rule berikut:

- `Bronze`: `>= Rp0`
- `Silver`: `> Rp200.000`
- `Gold`: `> Rp600.000`
- `Diamond`: `> Rp1.000.000`

Implementasi aktif:

```ts
if (totalSpentIDR > 1000000) return 'diamond'
if (totalSpentIDR > 600000) return 'gold'
if (totalSpentIDR > 200000) return 'silver'
return 'bronze'
```

## Contoh Hasil Tier

- `Rp0` -> `Bronze`
- `Rp200.000` -> `Bronze`
- `Rp200.001` -> `Silver`
- `Rp600.000` -> `Silver`
- `Rp600.001` -> `Gold`
- `Rp1.000.000` -> `Gold`
- `Rp1.000.001` -> `Diamond`

## Progress Ke Tier Berikutnya

Sisa nominal ke tier berikutnya dihitung dari ambang minimum tier target dikurangi `totalSpentIDR`.

Contoh:

- user sekarang `Bronze`
- `totalSpentIDR = Rp125.000`
- target berikutnya `Silver`
- ambang `Silver = Rp200.001`

Maka:

`remaining = 200.001 - 125.000 = Rp75.001`

## Snapshot Saat Order Selesai

Saat order selesai, sistem juga menyimpan data terkait membership ke order:

- `memberTierSnapshot`
- `subtotalBeforeDiscount`
- `discountAmount`
- `voucher`
- `voucherCode`

Tujuannya agar histori transaksi tetap konsisten walau tier user berubah di masa depan.

## Relasi Dengan Voucher

Voucher member bisa dibatasi berdasarkan:

- tier yang diizinkan
- minimum belanja
- limit total penggunaan
- limit per user
- masa aktif / TTL

User hanya bisa melihat dan memilih voucher yang lolos semua syarat itu.

## Catatan Implementasi Saat Ini

- member baru dari login Google langsung mulai di `Bronze`
- `memberSince` diset saat akun member dibuat
- tier diperbarui otomatis melalui hook order
- dasar perhitungan masih memakai transaksi final, belum memakai poin terpisah

## File Implementasi Terkait

- `src/lib/member.ts`
- `src/lib/vouchers.ts`
- `src/plugins/index.ts`
- `src/collections/Users/index.ts`
- `src/collections/Coupons.ts`
- `src/payments/pakasir/index.ts`
