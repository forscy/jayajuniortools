import { PrismaClient, Role, UserStatus } from '@prisma/client';
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const createUsers = async () => {
  const hashPassword = await bcrypt.hash('securepassword', 10); // Meng-hash password

  const users = [
    {
      name: 'owner',
      email: 'owner@gmail.com',
      password: hashPassword,
      role: Role.OWNER,
      
    },
    {
      name: 'shopkeeper1',
      email: 'shopkeeper1@gmail.com',
      password: hashPassword,
      role: Role.SHOPKEEPER,
      
    },
    {
      name: 'shopkeeper2',
      email: 'shopkeeper2@gmail.com',
      password: hashPassword,
      role: Role.SHOPKEEPER,
      
    },
    {
      name: 'shopkeeper3',
      email: 'shopkeeper3@gmail.com',
      password: hashPassword,
      role: Role.SHOPKEEPER,
      
    },
    {
      name: 'inventorymanager',
      email: 'inventorymanager@gmail.com',
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
  
  console.log('Seeder untuk user berhasil dijalankan!');
};

const runSeeder = async () => {
  try {
    await createUsers();
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
};

runSeeder();