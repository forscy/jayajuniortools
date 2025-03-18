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
│   │   │   ├── userController.ts
│   │   │   ├── productController.ts
│   │   │   └── orderController.ts
│   │   ├── services                # Folder untuk service yang menangani logika bisnis
│   │   │   ├── userService.ts
│   │   │   ├── productService.ts
│   │   │   └── orderService.ts
│   │   ├── routes                  # Folder untuk routing
│   │   │   ├── userRoutes.ts
│   │   │   ├── productRoutes.ts
│   │   │   └── orderRoutes.ts
│   │   ├── middlewares             # Folder untuk middleware seperti validasi, otentikasi
│   │   │   └── authMiddleware.ts
│   │   ├── utils                   # Utility functions yang umum digunakan
│   │   │   └── logger.ts
│   │   ├── app.ts                  # File utama untuk setup express app
│   │   └── server.ts               # File untuk menjalankan server
│   └── node_modules                # Folder dependensi
└── frontend/                      # Folder frontend (misal React) jika terintegrasi dalam satu repositori
├── docker-compose.prod.yml
└── docker-compose.dev.yml