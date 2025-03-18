import { PrismaClient, Role, UserStatus } from '@prisma/client';
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Mengecek apakah sudah ada user dengan role OWNER
  const existingOwner = await prisma.user.findFirst({
    where: {
      role: Role.OWNER,
    },
  });

  // Jika tidak ada owner, maka buat user owner baru
  if (!existingOwner) {
    await prisma.user.create({
      data: {
        name: 'Roy', // Nama Owner
        email: 'owner@jayajuniortools.com', // Email Owner
        password: await bcrypt.hash('securepassword', 10), // Password (pastikan di-hash di aplikasi nyata)
        status: UserStatus.ACTIVE, // Status akun
        role: Role.OWNER, // Peran sebagai Owner
      },
    });
    console.log('Owner user has been created!');
  } else {
    console.log('Owner user already exists!');
  }

  // create buyer
  const existingBuyer = await prisma.user.findFirst({
    where: {
      role: Role.BUYER,
    },
  });

  if (!existingBuyer) {
    await prisma.user.create({
      data: {
        name: 'Buyer', // Nama Buyer
        email: 'buyer1@gmail.com', // Email Buyer
        password: await bcrypt.hash('securepassword', 10), // Password (pastikan di-hash di aplikasi nyata)
        status: UserStatus.ACTIVE, // Status akun
        role: Role.BUYER, // Peran sebagai Buyer
      },
    });
    console.log('Buyer user has been created!');
  } else {
    console.log('Buyer user already exists!');
  }
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
