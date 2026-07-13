# Penetration Red Team Skill: Analisis Celah Keamanan

Skill ini dirancang untuk melakukan analisis celah keamanan pada **aplikasi web**, **API**, dan **dependensi** dalam proyek. Skill ini mengikuti metodologi **OWASP Top 10**, **OWASP API Top 10**, dan praktik terbaik untuk **Software Composition Analysis (SCA)**.

---

## **1. Tujuan Skill**
Skill ini bertujuan untuk:
- Mengidentifikasi celah keamanan pada aplikasi web berdasarkan **OWASP Top 10**.
- Menganalisis celah keamanan pada **API** berdasarkan **OWASP API Top 10**.
- Memeriksa kerentanan pada **dependensi** proyek (CVE, SCA).
- Memberikan rekomendasi mitigasi untuk setiap celah yang ditemukan.

---

## **2. Cakupan Analisis**
### **2.1 Aplikasi Web (OWASP Top 10)**
| Kategori                     | Deskripsi                                                                                     |
|------------------------------|---------------------------------------------------------------------------------------------|
| **A01:2021 – Broken Access Control**       | Memeriksa akses yang tidak sah ke fitur atau data.                                          |
| **A02:2021 – Cryptographic Failures**      | Memeriksa penggunaan enkripsi yang lemah atau tidak aman.                                   |
| **A03:2021 – Injection**                   | Memeriksa kerentanan terhadap serangan injeksi (SQL, NoSQL, OS, dll.).                     |
| **A04:2021 – Insecure Design**             | Memeriksa desain sistem yang tidak aman (misalnya, kurangnya validasi input).               |
| **A05:2021 – Security Misconfiguration**   | Memeriksa konfigurasi keamanan yang salah (misalnya, default credentials, error messages).  |
| **A06:2021 – Vulnerable and Outdated Components** | Memeriksa penggunaan komponen yang rentan atau usang.                                      |
| **A07:2021 – Identification and Authentication Failures** | Memeriksa kegagalan dalam autentikasi dan manajemen sesi.                                  |
| **A08:2021 – Software and Data Integrity Failures** | Memeriksa integritas data dan perangkat lunak (misalnya, deserialisasi tidak aman).        |
| **A09:2021 – Security Logging and Monitoring Failures** | Memeriksa kurangnya logging dan pemantauan keamanan.                                       |
| **A10:2021 – Server-Side Request Forgery (SSRF)** | Memeriksa kerentanan SSRF pada aplikasi.                                                   |

---

### **2.2 API (OWASP API Top 10)**
| Kategori                     | Deskripsi                                                                                     |
|------------------------------|---------------------------------------------------------------------------------------------|
| **API1:2023 – Broken Object Level Authorization** | Memeriksa akses tidak sah ke objek data.                                                    |
| **API2:2023 – Broken Authentication**         | Memeriksa kegagalan dalam autentikasi API.                                                  |
| **API3:2023 – Broken Object Property Level Authorization** | Memeriksa akses tidak sah ke properti objek.                                               |
| **API4:2023 – Unrestricted Resource Consumption** | Memeriksa konsumsi sumber daya yang tidak terbatas (misalnya, DoS).                        |
| **API5:2023 – Broken Function Level Authorization** | Memeriksa akses tidak sah ke fungsi API.                                                    |
| **API6:2023 – Unrestricted Access to Sensitive Business Flows** | Memeriksa akses tidak terbatas ke alur bisnis sensitif.                                    |
| **API7:2023 – Server-Side Request Forgery (SSRF)** | Memeriksa kerentanan SSRF pada API.                                                         |
| **API8:2023 – Security Misconfiguration**    | Memeriksa konfigurasi keamanan yang salah pada API.                                         |
| **API9:2023 – Improper Inventory Management** | Memeriksa manajemen inventori API yang tidak tepat.                                         |
| **API10:2023 – Unsafe Consumption of APIs**  | Memeriksa penggunaan API yang tidak aman (misalnya, kurangnya validasi input).              |

---

### **2.3 Dependensi (SCA - Software Composition Analysis)**
| Kategori                     | Deskripsi                                                                                     |
|------------------------------|---------------------------------------------------------------------------------------------|
| **CVE (Common Vulnerabilities and Exposures)** | Memeriksa kerentanan yang terdaftar di database CVE.                                        |
| **Outdated Dependencies**    | Memeriksa dependensi yang usang atau tidak lagi didukung.                                   |
| **License Risks**            | Memeriksa risiko lisensi pada dependensi (misalnya, lisensi yang tidak kompatibel).         |
| **Known Exploits**           | Memeriksa dependensi yang memiliki eksploitasi yang diketahui.                              |

---

## **3. Langkah-Langkah Analisis**
### **3.1 Persiapan**
1. **Identifikasi Lingkup**: Tentukan bagian aplikasi, API, atau dependensi yang akan dianalisis.
2. **Kumpulkan Informasi**:
   - Daftar endpoint API.
   - Daftar dependensi (gunakan `package.json`, `pom.xml`, `requirements.txt`, dll.).
   - Dokumentasi aplikasi dan API.
3. **Siapkan Tools**:
   - **Aplikasi Web**: OWASP ZAP, Burp Suite, Nuclei.
   - **API**: Postman, OWASP ZAP, Burp Suite.
   - **Dependensi**: `npm audit`, `snyk`, `dependabot`, `trivy`.

---

### **3.2 Analisis Aplikasi Web (OWASP Top 10)**
1. **Broken Access Control**:
   - Uji akses tidak sah ke fitur atau data (misalnya, IDOR, privilege escalation).
   - Verifikasi kebijakan CORS.
2. **Cryptographic Failures**:
   - Periksa penggunaan protokol enkripsi yang lemah (misalnya, TLS 1.0, SSL).
   - Verifikasi penyimpanan data sensitif (misalnya, password, token).
3. **Injection**:
   - Uji kerentanan SQL Injection, NoSQL Injection, OS Command Injection.
   - Gunakan tools seperti SQLmap atau OWASP ZAP.
4. **Insecure Design**:
   - Tinjau arsitektur aplikasi untuk desain yang tidak aman.
   - Verifikasi validasi input dan output.
5. **Security Misconfiguration**:
   - Periksa konfigurasi server, framework, dan database.
   - Verifikasi default credentials dan error messages.
6. **Vulnerable and Outdated Components**:
   - Gunakan tools seperti `npm audit`, `snyk`, atau `trivy` untuk memeriksa dependensi.
7. **Identification and Authentication Failures**:
   - Uji autentikasi (misalnya, brute force, session fixation).
   - Verifikasi manajemen sesi (misalnya, session timeout, cookie attributes).
8. **Software and Data Integrity Failures**:
   - Periksa deserialisasi tidak aman.
   - Verifikasi integritas data (misalnya, checksum, signature).
9. **Security Logging and Monitoring Failures**:
   - Periksa logging dan pemantauan keamanan (misalnya, log access, failed login).
10. **Server-Side Request Forgery (SSRF)**:
    - Uji kerentanan SSRF pada endpoint yang menerima URL eksternal.

---

### **3.3 Analisis API (OWASP API Top 10)**
1. **Broken Object Level Authorization**:
   - Uji akses tidak sah ke objek data (misalnya, IDOR).
2. **Broken Authentication**:
   - Uji autentikasi API (misalnya, JWT, OAuth).
3. **Broken Object Property Level Authorization**:
   - Uji akses tidak sah ke properti objek (misalnya, mass assignment).
4. **Unrestricted Resource Consumption**:
   - Uji konsumsi sumber daya yang tidak terbatas (misalnya, DoS).
5. **Broken Function Level Authorization**:
   - Uji akses tidak sah ke fungsi API (misalnya, admin endpoints).
6. **Unrestricted Access to Sensitive Business Flows**:
   - Uji akses tidak terbatas ke alur bisnis sensitif (misalnya, checkout, payment).
7. **Server-Side Request Forgery (SSRF)**:
   - Uji kerentanan SSRF pada API.
8. **Security Misconfiguration**:
   - Periksa konfigurasi keamanan API (misalnya, CORS, rate limiting).
9. **Improper Inventory Management**:
   - Periksa dokumentasi API dan versi yang digunakan.
10. **Unsafe Consumption of APIs**:
    - Uji validasi input dan output pada konsumsi API eksternal.

---

### **3.4 Analisis Dependensi (SCA)**
1. **CVE Check**:
   - Gunakan tools seperti `npm audit`, `snyk`, atau `trivy` untuk memeriksa CVE.
2. **Outdated Dependencies**:
   - Periksa dependensi yang usang atau tidak lagi didukung.
3. **License Risks**:
   - Verifikasi lisensi dependensi (misalnya, GPL, MIT, Apache).
4. **Known Exploits**:
   - Periksa dependensi yang memiliki eksploitasi yang diketahui.

---

## **4. Tools yang Digunakan**
| Kategori          | Tools                                                                                     |
|-------------------|-------------------------------------------------------------------------------------------|
| **Aplikasi Web**  | OWASP ZAP, Burp Suite, Nuclei, SQLmap, Nikto                                              |
| **API**           | Postman, OWASP ZAP, Burp Suite, RestAssured                                               |
| **Dependensi**    | `npm audit`, `snyk`, `dependabot`, `trivy`, `owasp-dependency-check`                     |
| **Infrastruktur** | Nmap, Metasploit, Nessus, OpenVAS                                                         |

---

## **5. Kriteria Kelengkapan**
1. **Dokumentasi Lengkap**:
   - Laporan analisis yang mencakup semua temuan.
   - Rekomendasi mitigasi untuk setiap celah yang ditemukan.
2. **Verifikasi Temuan**:
   - Pastikan semua temuan telah diverifikasi dan tidak ada false positive.
3. **Prioritas Mitigasi**:
   - Prioritaskan celah berdasarkan tingkat risiko (Critical, High, Medium, Low).
4. **Tindak Lanjut**:
   - Rencana tindak lanjut untuk mitigasi dan pemantauan.

---

## **6. Contoh Penggunaan Skill**
### **6.1 Analisis Aplikasi Web**
```
@workspace /penetration_red_team analyze web --target src/app --owasp-top10
```

### **6.2 Analisis API**
```
@workspace /penetration_red_team analyze api --target src/api --owasp-api-top10
```

### **6.3 Analisis Dependensi**
```
@workspace /penetration_red_team analyze dependencies --target package.json --sca
```

---

## **7. Rekomendasi Tindak Lanjut**
1. **Mitigasi Cepat**:
   - Perbaiki celah dengan tingkat risiko **Critical** dan **High** terlebih dahulu.
2. **Pemantauan Berkelanjutan**:
   - Gunakan tools seperti `dependabot` atau `snyk` untuk pemantauan dependensi.
3. **Pelatihan Keamanan**:
   - Lakukan pelatihan keamanan untuk tim pengembang.
4. **Audit Berkala**:
   - Lakukan audit keamanan secara berkala (misalnya, setiap 3 bulan).

---

## **8. Referensi**
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP API Top 10](https://owasp.org/www-project-api-security/)
- [CVE Database](https://cve.mitre.org/)
- [Snyk](https://snyk.io/)
- [Trivy](https://github.com/aquasecurity/trivy)

---

Skill ini dapat disesuaikan lebih lanjut berdasarkan kebutuhan spesifik proyek Anda.