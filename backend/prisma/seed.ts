import {
  Brand,
  Category,
  DiscountType,
  PrismaClient,
  Role,
  UserStatus,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const createUsers = async () => {
  const hashPassword = await bcrypt.hash("securepassword", 10); // Meng-hash password

  const users = [
    {
      name: "owner",
      email: "owner@gmail.com",
      password: hashPassword,
      role: Role.OWNER,
    },
    {
      name: "shopkeeper1",
      email: "shopkeeper1@gmail.com",
      password: hashPassword,
      role: Role.SHOPKEEPER,
    },
    {
      name: "shopkeeper2",
      email: "shopkeeper2@gmail.com",
      password: hashPassword,
      role: Role.SHOPKEEPER,
    },
    {
      name: "shopkeeper3",
      email: "shopkeeper3@gmail.com",
      password: hashPassword,
      role: Role.SHOPKEEPER,
    },
    {
      name: "inventorymanager",
      email: "inventorymanager@gmail.com",
      password: hashPassword,
      role: Role.INVENTORY_MANAGER,
    },
    // Membuat 10 pengguna Buyer dengan email buyer1, buyer2, ... buyer10
    ...Array.from({ length: 10 }, (_, index) => ({
      name: `buyer${index + 1}`,
      email: `buyer${index + 1}@gmail.com`,
      password: hashPassword,
      role: Role.BUYER,
    })),
  ];

  // Menambahkan data pengguna ke dalam database jika di database belum ada
  for (const user of users) {
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: user.password,
          status: UserStatus.ACTIVE,
          role: user.role,
        },
      });
    }
  }

  console.log("Seeder untuk user berhasil dijalankan!");
};

// seeder for create store profile
// const createStoreProfile = async () => {
//   const store = {
//     name: 'Jaya Junior Tools',
//     address: 'Jl. Jalan Sini No. 123',
//     phone: '08123456789',
//     email: 'jayajuniortools@gmail.com',
//     description: 'Menjual berbagai macam perkakas tukang dan mesin-mesin perkakas',
//   };

//   const existingStore = await prisma.store.findFirst({
//     where: {
//       name: store.name,
//     },
//   });

//   if (!existingStore) {
//     await prisma.store.create({
//       data: store,
//     });
//   }

//   // create operational hours
//   const operationalHours: OperationalHour[] = [
//     {
//       id: 1,
//       storeId: existingStore?.id || 1,
//       day: Day.MONDAY,
//       openTime: '07:00:00',
//       closeTime: '17:00:00',
//     },
//     // repeat for the rest of the days
//     {
//       id: 2,
//       storeId: existingStore?.id || 1,
//       day: Day.TUESDAY,
//       openTime: '07:00:00',
//       closeTime: '17:00:00',
//     },
//     {
//       id: 3,
//       storeId: existingStore?.id || 1,
//       day: Day.WEDNESDAY,
//       openTime: '07:00:00',
//       closeTime: '17:00:00',
//     },
//     {
//       id: 4,
//       storeId: existingStore?.id || 1,
//       day: Day.THURSDAY,
//       openTime: '07:00:00',
//       closeTime: '17:00:00',
//     },
//     {
//       id: 5,
//       storeId: existingStore?.id || 1,
//       day: Day.FRIDAY,
//       openTime: '07:00:00',
//       closeTime: '17:00:00',
//     },
//     {
//       id: 6,
//       storeId: existingStore?.id || 1,
//       day: Day.SATURDAY,
//       openTime: '07:00:00',
//       closeTime: '17:00:00',
//     },
//     {
//       id: 7,
//       storeId: existingStore?.id || 1,
//       day: Day.SUNDAY,
//       openTime: '09:00:00',
//       closeTime: '17:00:00',
//     },
//   ]

//   // write to database
//   for (const operationalHour of operationalHours) {
//     const existingOperationalHour = await prisma.operationalHour.findUnique({
//       where: {
//         id: operationalHour.id,
//       },
//     });

//     if (!existingOperationalHour) {
//       await prisma.operationalHour.create({
//         data: operationalHour,
//       });
//     }
//   }

//   console.log('Seeder untuk store berhasil dijalankan!');
// }

// create category product tools

const createCategories = async () => {
  const categories = [
    {
      id: 1,
      name: "Mesin Perkakas",
      description:
        "Berbagai mesin perkakas untuk keperluan konstruksi dan pekerjaan kayu",
    },
    {
      id: 2,
      name: "Perkakas Tangan",
      description: "Alat-alat perkakas manual untuk berbagai keperluan",
    },
    {
      id: 3,
      name: "Peralatan Listrik",
      description:
        "Peralatan yang berhubungan dengan kelistrikan dan elektronik",
    },
    {
      id: 4,
      name: "Alat Ukur",
      description: "Peralatan untuk pengukuran yang presisi",
    },
    {
      id: 5,
      name: "Perlengkapan Keselamatan",
      description: "Perlengkapan untuk keselamatan kerja",
    },
    {
      id: 6,
      name: "Aksesoris & Suku Cadang",
      description: "Berbagai aksesoris dan suku cadang untuk perkakas",
    },
  ];

  // Insert categories to database if not exists
  for (const category of categories) {
    const existingCategory = await prisma.category.findUnique({
      where: { id: category.id },
    });

    if (!existingCategory) {
      await prisma.category.create({
        data: category,
      });
    }
  }

  console.log("Seeder untuk kategori berhasil dijalankan!");
};

// Create brands
const createBrands = async () => {
  const brands = [
    {
      id: 1,
      name: "Tekiro",
      description: "Merk terkenal untuk peralatan listrik profesional",
      logoUrl: "https://example.com/logos/tekiro.png",
    },
    {
      id: 2,
      name: "GripOn",
      description: "Spesialis perkakas tangan berkualitas tinggi",
      logoUrl: "https://example.com/logos/gripOn.png",
    },
    {
      id: 3,
      name: "Toho",
      description: "Solusi lengkap untuk semua kebutuhan pertukangan",
      logoUrl: "https://example.com/logos/toho.png",
    },
    {
      id: 4,
      name: "Lipro",
      description: "Produk keselamatan kerja berkualitas internasional",
      logoUrl: "https://example.com/logos/lipro.png",
    },
    {
      id: 5,
      name: "Molar",
      description: "Alat ukur presisi untuk profesional",
      logoUrl: "https://example.com/logos/molar.png",
    },
  ];

  // Insert brands to database if not exists
  for (const brand of brands) {
    const existingBrand = await prisma.brand.findUnique({
      where: { id: brand.id },
    });

    if (!existingBrand) {
      await prisma.brand.create({
        data: brand,
      });
    }
  }

  console.log("Seeder untuk brand berhasil dijalankan!");
};

// Create products with inventories
const createProducts = async () => {

    // Product categories relationship
  // Products data
  const products = [
    {
      id: 1,
      name: "Mesin Bor Listrik 13mm",
      description:
        "Mesin bor listrik dengan chuck 13mm, cocok untuk penggunaan profesional",
      retailPrice: 450000,
      wholesalePrice: 380000,
      minWholesaleQty: 3,
      sku: "BOR-PRO-13MM",
      brandId: 1,
      locationName: "Main Warehouse",
      quantityInStock: 25,
      minimumStock: 5,
    },
    {
      id: 2,
      name: "Set Obeng 12 pcs",
      description:
        "Set obeng dengan 6 obeng plus dan 6 obeng minus berbagai ukuran",
      retailPrice: 125000,
      wholesalePrice: 105000,
      minWholesaleQty: 5,
      sku: "OBG-SET-12",
      brandId: 2,
      locationName: "Main Warehouse",
      quantityInStock: 15,
      minimumStock: 3,
    },
    {
      id: 3,
      name: "Gergaji Listrik Circular 7 Inch",
      description:
        "Gergaji listrik circular untuk memotong kayu dengan presisi tinggi",
      retailPrice: 850000,
      wholesalePrice: 750000,
      minWholesaleQty: 2,
      sku: "GRG-CIR-7",
      brandId: 1,
      locationName: "Main Warehouse",
      quantityInStock: 50,
      minimumStock: 10,
    },
    {
      id: 4,
      name: "Kacamata Safety Clear",
      description:
        "Kacamata pelindung dengan lensa clear anti-fog untuk perlindungan mata",
      retailPrice: 45000,
      wholesalePrice: 35000,
      minWholesaleQty: 10,
      sku: "KCM-SFT-CLR",
      locationName: "Main Warehouse",
      quantityInStock: 30,
      minimumStock: 5,
    },
    {
      id: 5,
      name: "Set Kunci Pas 8-24mm",
      description: "Set lengkap kunci pas dengan ukuran 8mm hingga 24mm",
      retailPrice: 275000,
      wholesalePrice: 235000,
      minWholesaleQty: 3,
      sku: "KNC-PAS-SET",
      locationName: "Main Warehouse",
      quantityInStock: 100,
      minimumStock: 20,
    },
    {
      id: 6,
      name: "Meteran Digital 5m",
      description:
        "Meteran digital dengan jangkauan hingga 5 meter dengan akurasi tinggi",
      retailPrice: 185000,
      wholesalePrice: 160000,
      minWholesaleQty: 5,
      sku: "MTR-DIG-5M",
      locationName: "Main Warehouse",
      quantityInStock: 40,
      minimumStock: 8,
    },
    {
      id: 7,
      name: "Helm Safety Kuning",
      description:
        "Helm safety standar industri warna kuning dengan sertifikasi SNI",
      retailPrice: 85000,
      wholesalePrice: 70000,
      minWholesaleQty: 10,
      sku: "HLM-SFT-KNG",
      locationName: "Main Warehouse",
      quantityInStock: 35,
      minimumStock: 7,
    },
    {
      id: 8,
      name: "Palu Karet 500g",
      description:
        "Palu dengan kepala karet, ideal untuk pemasangan ubin dan pekerjaan ringan",
      retailPrice: 45000,
      wholesalePrice: 38000,
      minWholesaleQty: 5,
      sku: "PLU-KRT-500",
      locationName: "Main Warehouse",
      quantityInStock: 20,
      minimumStock: 5,
    },
  ];

  // Create products
  for (const product of products) {
    const existingProduct = await prisma.product.findUnique({
      where: { id: product.id },
    });

    if (!existingProduct) {
      await prisma.product.create({
        data: product,
      });
    }
  }
  

  const productCategories = [
    { productId: 1, categoryName: "Mesin Perkakas" }, // Mesin Bor -> Mesin Perkakas
    { productId: 1, categoryName: "Mesin Perkakas" }, // Mesin Bor -> Peralatan Listrik
    { productId: 2, categoryName: "Mesin Perkakas" }, // Set Obeng -> Perkakas Tangan
    { productId: 3, categoryName: "Mesin Perkakas" }, // Gergaji Listrik -> Mesin Perkakas
    { productId: 3, categoryName: "Perkakas Tangan" }, // Gergaji Listrik -> Peralatan Listrik
    { productId: 4, categoryName: "Perkakas Tangan" }, // Kacamata Safety -> Perlengkapan Keselamatan
    { productId: 5, categoryName: "Perkakas Tangan" }, // Set Kunci Pas -> Perkakas Tangan
    { productId: 6, categoryName: "Perkakas Tangan" }, // Meteran Digital -> Alat Ukur
    { productId: 6, categoryName: "Peralatan Listrik" }, // Meteran Digital -> Peralatan Listrik
    { productId: 7, categoryName: "Peralatan Listrik" }, // Helm Safety -> Perlengkapan Keselamatan
    { productId: 8, categoryName: "Peralatan Listrik" }, // Palu Karet -> Perkakas Tangan
  ];

  // Create product categories relationship
  for (const pc of productCategories) {
    const existing = await prisma.productCategory.findFirst({
      where: {
        productId: pc.productId,
        categoryName: pc.categoryName
      },
    });

    if (!existing) {
      await prisma.productCategory.create({
        data: pc,
      });
    }
  }

  // Product images
  const productImages = [
    { productId: 1, url: "http://localhost:3003/uploads/products/no-product-image.png" },
    { productId: 1, url: "http://localhost:3003/uploads/products/no-product-image.png" },
    { productId: 2, url: "http://localhost:3003/uploads/products/no-product-image.png" },
    { productId: 3, url: "http://localhost:3003/uploads/products/no-product-image.png" },
    { productId: 4, url: "http://localhost:3003/uploads/products/no-product-image.png" },
    { productId: 5, url: "http://localhost:3003/uploads/products/no-product-image.png" },
    { productId: 6, url: "http://localhost:3003/uploads/products/no-product-image.png" },
    { productId: 7, url: "http://localhost:3003/uploads/products/no-product-image.png" },
    { productId: 8, url: "http://localhost:3003/uploads/products/no-product-image.png" },
  ];

  // Create product images
  for (const image of productImages) {
    const existing = await prisma.productImage.findFirst({
      where: {
        productId: image.productId,
        url: image.url,
      },
    });

    if (!existing) {
      await prisma.productImage.create({
        data: image,
      });
    }
  }

  // Create product discounts
  const now = new Date();
  const threeMonthsLater = new Date(now);
  threeMonthsLater.setMonth(now.getMonth() + 3);

  const discounts = [
    {
      name: "Promo Mesin Bor",
      description: "Diskon special untuk mesin bor",
      discountType: DiscountType.PERCENTAGE,
      discountValue: 10,
      startDate: now,
      endDate: threeMonthsLater,
      isActive: true,
    },
    {
      name: "Special Discount Gergaji",
      description: "Potongan harga khusus untuk gergaji listrik",
      discountType: DiscountType.FIXED,
      discountValue: 50000,
      startDate: now,
      endDate: threeMonthsLater,
      isActive: true,
    },
    {
      name: "Promo Set Kunci",
      description: "Diskon untuk pembelian set kunci pas",
      discountType: DiscountType.PERCENTAGE,
      discountValue: 15,
      startDate: now,
      endDate: threeMonthsLater,
      isActive: true,
    },
  ];

  // Create product discounts
  for (const discount of discounts) {
    const existing = await prisma.discount.findFirst({
      where: {
        name: discount.name,
      },
    });

    if (!existing) {
      await prisma.discount.create({
        data: discount,
      });
    }
  }

  console.log("Seeder untuk produk berhasil dijalankan!");
};

// Create some wishlist entries
// const createWishlists = async () => {
//   const wishlists = [
//     { email: "buyer1@gmail.com", productId: 1 },
//     { email: "buyer1@gmail.com", productId: 3 },
//     { email: "buyer2@gmail.com", productId: 2 },
//     { email: "buyer3@gmail.com", productId: 5 },
//     { email: "buyer4@gmail.com", productId: 7 },
//   ];

//   for (const wishlist of wishlists) {
//     const existing = await prisma.wishlist.findFirst({
//       where: {
//         email: wishlist.email,
//         productId: wishlist.productId,
//       },
//     });

//     if (!existing) {
//       await prisma.wishlist.create({
//         data: wishlist,
//       });
//     }
//   }

//   console.log("Seeder untuk wishlist berhasil dijalankan!");
// };

// Create some reviews
const createReviews = async () => {
  const reviews = [
    {
      id: 1,
      productId: 1,
      email: "buyer1@gmail.com",
      rating: 5,
      comment: "Mesin bor yang sangat bagus dan kuat. Sangat merekomendasikan!",
    },
    {
      id: 2,
      productId: 1,
      email: "buyer1@gmail.com",
      rating: 4,
      comment: "Kualitas bagus, tapi agak berat untuk penggunaan lama.",
    },
    {
      id: 3,
      productId: 2,
      email: "buyer1@gmail.com",
      rating: 5,
      comment: "Set obeng yang sangat lengkap dan kualitasnya bagus.",
    },
    {
      id: 4,
      productId: 3,
      email: "buyer2@gmail.com",
      rating: 4,
      comment: "Gergaji yang bagus, potongannya rapi dan presisi.",
    },
    {
      id: 5,
      productId: 5,
      email: "buyer3@gmail.com",
      rating: 5,
      comment:
        "Set kunci pas yang lengkap, material kokoh dan nyaman digenggam.",
    },
  ];

  for (const review of reviews) {
    const existing = await prisma.review.findFirst({
      where: {
        email: review.email,
        productId: review.productId,
      },
    });

    if (!existing) {
      await prisma.review.create({
        data: review,
      });
    }
  }

  console.log("Seeder untuk review berhasil dijalankan!");
};

const runSeeder = async () => {
  try {
    await createUsers();
    await createCategories();
    await createBrands();
    await createProducts();
    // await createWishlists();
    await createReviews();
    console.log("Semua seeder berhasil dijalankan!");
  } catch (e) {
    console.error("Error saat menjalankan seeder:", e);
  } finally {
    await prisma.$disconnect();
  }
};

runSeeder();
