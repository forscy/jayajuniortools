# ```Jaya Junior Tools```

Project Online Shop untuk toko perkakas dan kunci.

## Persyaratan

Sebelum memulai, pastikan Anda memiliki perangkat lunak berikut yang terinstal di sistem Anda:

- [Node.js](https://nodejs.org/) (versi 20.16.0 atau lebih baru)
- [npm](https://www.npmjs.com/) (versi 10.9.2 atau lebih baru)

## ```Inisialisasi Backend untuk Proyek Awal Pengembangan```

Ikuti langkah-langkah di bawah ini untuk memulai proyek ini:

### **Kloning Repositori**

   Jika Anda belum memiliki repositori proyek, buat direktori baru dan inisialisasi dengan npm:

   ```bash
   mkdir backend
   cd backend
   npm init -y
   ```

### **Instalasi Dependensi**
1. **`express`**:
   - **Fungsi**: Merupakan framework web minimalis untuk Node.js yang memudahkan pembuatan aplikasi web dan API dengan menyediakan berbagai fitur seperti routing, middleware, dan penanganan permintaan HTTP.
   - **Instalasi**:
     ```bash
     npm install express
     ```

2. **`typescript`**:
   - **Fungsi**: Bahasa pemrograman yang merupakan superset dari JavaScript, menambahkan fitur tipe statis dan objek berorientasi untuk meningkatkan skalabilitas dan pemeliharaan kode.
   - **Instalasi**:
     ```bash
     npm install --save-dev typescript
     ```

3. **`ts-node`**:
   - **Fungsi**: Alat yang memungkinkan eksekusi file TypeScript secara langsung tanpa perlu kompilasi manual, mempercepat siklus pengembangan.
   - **Instalasi**:
     ```bash
     npm install --save-dev ts-node
     ```

4. **`@types/node`**:
   - **Fungsi**: Menyediakan definisi tipe untuk Node.js, memungkinkan TypeScript memahami tipe dan API yang tersedia dalam lingkungan Node.js.
   - **Instalasi**:
     ```bash
     npm install --save-dev @types/node
     ```

5. **`@types/express`**:
   - **Fungsi**: Menyediakan definisi tipe untuk Express, memungkinkan TypeScript memahami tipe dan API yang tersedia dalam framework Express.
   - **Instalasi**:
     ```bash
     npm install --save-dev @types/express
     ```

## Dependensi Tambahan

1. **`cors`**:
   - **Fungsi**: Middleware yang mengelola Cross-Origin Resource Sharing (CORS), memungkinkan kontrol akses sumber daya antara server dan klien dari domain yang berbeda.
   - **Instalasi**:
     ```bash
     npm install cors
     ```

2. **`dotenv`**:
   - **Fungsi**: Memungkinkan penggunaan variabel lingkungan yang disimpan dalam file `.env`, membantu dalam pengelolaan konfigurasi aplikasi secara terpusat dan aman.
   - **Instalasi**:
     ```bash
     npm install dotenv
     ```

3. **`morgan`**:
   - **Fungsi**: Middleware untuk logging HTTP request, berguna untuk debugging dan monitoring dengan mencatat detail setiap permintaan yang masuk.
   - **Instalasi**:
     ```bash
     npm install morgan
     ```

4. **`helmet`**:
   - **Fungsi**: Meningkatkan keamanan aplikasi dengan menetapkan header HTTP yang sesuai, membantu melindungi dari berbagai serangan web.
   - **Instalasi**:
     ```bash
     npm install helmet
     ```

5. **`joi`** atau **`zod`**:
   - **Fungsi**: Digunakan untuk validasi skema data, memastikan integritas dan konsistensi data yang masuk ke aplikasi.
   - **Instalasi** (misalnya menggunakan `joi`):
     ```bash
     npm install joi
     ```

6. **`lodash`**:
   - **Fungsi**: Menyediakan utilitas untuk manipulasi data dan operasi umum lainnya, seperti pengolahan array, objek, dan fungsi.
   - **Instalasi**:
     ```bash
     npm install lodash
     ```

7. **`prisma`** atau **`typeorm`**:
   - **Fungsi**: ORM (Object-Relational Mapping) yang memudahkan interaksi dengan basis data, menyediakan abstraksi tingkat tinggi untuk operasi basis data.
   - **Instalasi** (misalnya menggunakan `prisma`):
     ```bash
     npm install prisma
     ```

8. **`jest`**:
   - **Fungsi**: Framework pengujian yang menyediakan berbagai fitur untuk menulis dan menjalankan tes unit dan integrasi, memastikan kualitas kode.
   - **Instalasi**:
     ```bash
     npm install --save-dev jest
     ```

9. **`supertest`**:
   - **Fungsi**: Digunakan untuk menguji endpoint HTTP secara integratif, memungkinkan simulasi permintaan dan verifikasi respons aplikasi.
   - **Instalasi**:
     ```bash
     npm install --save-dev supertest
     ```

10. **`prettier`**:
    - **Fungsi**: Formatter kode yang membantu menjaga konsistensi gaya penulisan kode dengan secara otomatis memformat kode sesuai dengan aturan yang ditentukan.
    - **Instalasi**:
      ```bash
      npm install --save-dev prettier
      ```

11. **`eslint`**:
    - **Fungsi**: Alat untuk menganalisis kode dan menemukan masalah potensial, membantu menjaga kualitas kode dengan mendeteksi kesalahan dan potensi bug.
    - **Instalasi**:
      ```bash
      npm install --save-dev eslint
      ```

Instalasi Seluruh dependensi
```bash
npm install express cors dotenv morgan helmet joi lodash prisma typeorm
```
```bash
npm install --save-dev typescript ts-node @types/node @types/express jest supertest prettier eslint
```
## ```Docker Configuration```
Running **```development```** mode
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

Running **```production```** mode
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```

Config .env di docker itu tinggal menambahkan ``` * --env-file nama-file-env```


## ```Penutup```

Dengan memahami fungsi dan tujuan dari setiap dependensi di atas, Anda dapat memilih dan mengonfigurasi pustaka yang sesuai dengan kebutuhan proyek Anda. Pastikan untuk selalu memeriksa dokumentasi resmi masing-masing pustaka untuk informasi lebih lanjut dan praktik terbaik dalam penggunaannya. 
3. **Konfigurasi TypeScript**

   Buat file `tsconfig.json` di root proyek dengan konfigurasi berikut:

   ```json
   {
     "compilerOptions": {
       "target": "ES6",
       "module": "commonjs",
       "outDir": "./dist",
       "rootDir": "./src",
       "strict": true,
       "esModuleInterop": true
     },
     "include": ["src/**/*.ts"],
     "exclude": ["node_modules"]
   }
   ```

4. **Struktur Direktori Proyek**

   Buat struktur direktori sebagai berikut:

   ```
   /backend
     /src
       index.ts
   ```

5. **Membuat Server Express**

   Di dalam `src/index.ts`, tambahkan kode berikut untuk membuat server Express sederhana:

   ```typescript
   import express, { Request, Response } from 'express';

   const app = express();
   const port = 3000;

   app.get('/', (req: Request, res: Response) => {
     res.send('Halo, Dunia!');
   });

   app.listen(port, () => {
     console.log(`Server berjalan di http://localhost:${port}`);
   });
   ```

6. **Menjalankan Aplikasi**

   Tambahkan script berikut di `package.json` untuk memudahkan menjalankan server:

   ```json
   "scripts": {
     "start": "ts-node src/index.ts"
   }
   ```

   Kemudian, jalankan server dengan perintah:

   ```bash
   npm start
   ```



## ```DATABASE CONFIGURATION```
```
npx prisma generate
```
```
npx prisma migrate dev --name init
```








## Lisensi

Informasi lisensi proyek Anda.


Dengan mengikuti petunjuk di atas, Anda dapat memulai proyek backend menggunakan Express dan TypeScript. Untuk informasi lebih lanjut, Anda dapat merujuk ke dokumentasi resmi [Express](https://expressjs.com/) dan [TypeScript](https://www.typescriptlang.org/). 