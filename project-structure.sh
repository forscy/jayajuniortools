jayajuniortools
│
├── backend
│   ├── Dockerfile                  # Dockerfile untuk build aplikasi   # Docker Compose untuk dev environment
│   ├── package.json                # Menyimpan dependensi dan skrip project
│   ├── tsconfig.json               # Konfigurasi TypeScript
│   ├── .env                        # Menyimpan variabel lingkungan
│   ├── prisma
│   │   ├── schema.prisma           # Prisma schema untuk model dan database
│   │   └── migrations/             # Menyimpan folder migrasi untuk Prisma
│   ├── src
│   │   ├── controllers             # Folder untuk controller API
│   │   │   ├── user.controller.ts
│   │   │   ├── product.controller.ts
│   │   │   └── order.controller.ts
│   │   ├── services                # Folder untuk service yang menangani logika bisnis
│   │   │   ├── user.service.ts
│   │   │   ├── product.service.ts
│   │   │   └── order.service.ts
│   │   ├── routes                  # Folder untuk routing
│   │   │   ├── user.routes.ts
│   │   │   ├── product.routes.ts
│   │   │   └── order.routes.ts
│   │   ├── middlewares             # Folder untuk middleware seperti validasi, otentikasi
│   │   │   └── auth.midleware.ts
│   │   ├── utils                   # Utility functions yang umum digunakan
│   │   │   └── logger.ts
│   │   ├── app.ts                  # File utama untuk setup express app
│   │   └── server.ts               # File untuk menjalankan server
│   └── node_modules                # Folder dependensi
└── frontend/                      # Folder frontend (misal React) jika terintegrasi dalam satu repositori
├── docker-compose.prod.yml
└── docker-compose.dev.yml