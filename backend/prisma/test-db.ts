import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const product = await prisma.product.findUnique({
    where: {
      id: 2,
    },
    include: {
      categories: {
        select: {
          category: {
            select: {
              name: true,
            },
          }
        }
      },
      imageUrls: true,
      discount: true,
      reviews: true,
      brand: true
    },
  });

  // Menampilkan data dengan format yang lebih mudah dibaca
  console.log(JSON.stringify(product, null, 2));
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });