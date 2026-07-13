# **Laporan Analisis Celah Keamanan - CitraCommerce**

## **1. Informasi Umum**
- **Tanggal Analisis**: 9 Juli 2026
- **Tim Analisis**: Penetration Red Team
- **Lingkup Analisis**:
  - Aplikasi Web (OWASP Top 10)
  - API (OWASP API Top 10)
  - Dependensi (SCA)

---

## **2. Ringkasan Temuan**
| Kategori               | Jumlah Temuan | Tingkat Risiko Tertinggi |
|------------------------|---------------|--------------------------|
| **Dependensi (SCA)**   | 16            | Critical                 |
| **Aplikasi Web**       | 3             | High                     |
| **API**                | 3             | High                     |

---

## **3. Temuan dan Rekomendasi**

### **3.1 Dependensi (SCA)**
#### **Temuan**
- Terdapat **16 kerentanan** pada dependensi proyek, dengan rincian:
  - **Critical**: 1 (DOMPurify)
  - **Moderate**: 15
  - **Low**: 3
- Kerentanan paling kritis adalah **DOMPurify** (CVE-2026-49978 dan GHSA-cmwh-pvxp-8882).

#### **Rekomendasi**
- Perbarui **DOMPurify** ke versi **3.4.11 atau lebih baru**.
- Jalankan `pnpm audit fix` untuk memperbarui dependensi yang rentan.
- Gunakan tools seperti **Snyk** atau **Dependabot** untuk pemantauan berkelanjutan.

---

### **3.2 Aplikasi Web (OWASP Top 10)**
#### **Temuan 1: Broken Access Control**
- **Deskripsi**: Tidak ada validasi tambahan untuk mencegah **Insecure Direct Object Reference (IDOR)** pada akses data pengguna.
- **Lokasi**: `src/access/isDocumentOwner.ts`, `src/access/isAdmin.ts`
- **Risiko**: High

#### **Rekomendasi**
- Tambahkan validasi untuk memastikan pengguna hanya dapat mengakses data yang mereka miliki.
- Gunakan **UUID** atau **random ID** untuk mencegah IDOR.

---

#### **Temuan 2: Cryptographic Failures**
- **Deskripsi**: Data sensitif seperti **password**, **token**, dan **API keys** tidak dienkripsi sebelum disimpan.
- **Lokasi**: Tidak ditemukan penggunaan enkripsi pada field sensitif.
- **Risiko**: High

#### **Rekomendasi**
- Gunakan library seperti **bcrypt** atau **argon2** untuk menyimpan password.
- Enkripsi field sensitif seperti `googleId` sebelum disimpan.

---

#### **Temuan 3: Security Misconfiguration**
- **Deskripsi**: Endpoint dengan akses **public** (`publicAccess`) dapat dieksploitasi untuk mengakses data sensitif.
- **Lokasi**: `src/access/publicAccess.ts`
- **Risiko**: Medium

#### **Rekomendasi**
- Batasi akses publik hanya untuk endpoint yang benar-benar diperlukan.
- Gunakan **rate limiting** untuk mencegah serangan brute force.

---

### **3.3 API (OWASP API Top 10)**
#### **Temuan 1: Broken Object Level Authorization (BOLA)**
- **Deskripsi**: Endpoint `Users` mengizinkan operasi **create** tanpa autentikasi (`create: publicAccess`).
- **Lokasi**: `src/collections/Users/index.ts`
- **Risiko**: High

#### **Rekomendasi**
- Batasi akses **create** hanya untuk pengguna yang terautentikasi atau admin.

---

#### **Temuan 2: Broken Authentication**
- **Deskripsi**: Token JWT memiliki masa berlaku yang lama (**2 minggu**).
- **Lokasi**: `src/collections/Users/index.ts` (`tokenExpiration: 1209600`)
- **Risiko**: High

#### **Rekomendasi**
- Kurangi masa berlaku token JWT menjadi **1 hari** atau kurang.
- Gunakan **refresh token** untuk memperpanjang sesi.

---

#### **Temuan 3: Security Misconfiguration**
- **Deskripsi**: Field sensitif seperti `googleId` disimpan sebagai **plain text**.
- **Lokasi**: `src/collections/Users/index.ts`
- **Risiko**: Medium

#### **Rekomendasi**
- Enkripsi field sensitif sebelum disimpan.

---

## **4. Prioritas Mitigasi**
| Prioritas | Tindakan                                                                 |
|------------|--------------------------------------------------------------------------|
| **Critical** | Perbarui DOMPurify ke versi 3.4.11 atau lebih baru.                     |
| **High**     | Perbaiki Broken Access Control dan Broken Authentication.               |
| **Medium**   | Enkripsi field sensitif dan batasi akses publik.                         |

---

## **5. Tindak Lanjut**
1. **Mitigasi Cepat**: Perbaiki celah dengan tingkat risiko **Critical** dan **High** terlebih dahulu.
2. **Pemantauan Berkelanjutan**: Gunakan tools seperti **Dependabot** atau **Snyk** untuk pemantauan dependensi.
3. **Pelatihan Keamanan**: Lakukan pelatihan keamanan untuk tim pengembang.
4. **Audit Berkala**: Lakukan audit keamanan secara berkala (misalnya, setiap 3 bulan).

---

## **6. Referensi**
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP API Top 10](https://owasp.org/www-project-api-security/)
- [CVE Database](https://cve.mitre.org/)
- [Snyk](https://snyk.io/)
- [DOMPurify Security Advisory](https://github.com/cure53/DOMPurify/security/advisories)