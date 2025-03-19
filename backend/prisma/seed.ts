import { Day, OperationalHour, PrismaClient, Role, UserStatus } from '@prisma/client';
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


// seeder for create store profile
const createStoreProfile = async () => {
  const store = {
    name: 'Jaya Junior Tools',
    address: 'Jl. Jalan Sini No. 123',
    phone: '08123456789',
    email: 'jayajuniortools@gmail.com',
    description: 'Menjual berbagai macam perkakas tukang dan mesin-mesin perkakas',
  };

  const existingStore = await prisma.store.findFirst({
    where: {
      name: store.name,
    },
  });

  if (!existingStore) {
    await prisma.store.create({
      data: store,
    });
  }

  // create operational hours
  const operationalHours: OperationalHour[] = [
    {
      id: 1,
      storeId: existingStore?.id || 1,
      day: Day.MONDAY,
      openTime: '07:00:00',
      closeTime: '17:00:00',
    },
    // repeat for the rest of the days
    {
      id: 2,
      storeId: existingStore?.id || 1,
      day: Day.TUESDAY,
      openTime: '07:00:00',
      closeTime: '17:00:00',
    },
    {
      id: 3,
      storeId: existingStore?.id || 1,
      day: Day.WEDNESDAY,
      openTime: '07:00:00',
      closeTime: '17:00:00',
    },
    {
      id: 4,
      storeId: existingStore?.id || 1,
      day: Day.THURSDAY,
      openTime: '07:00:00',
      closeTime: '17:00:00',
    },
    {
      id: 5,
      storeId: existingStore?.id || 1,
      day: Day.FRIDAY,
      openTime: '07:00:00',
      closeTime: '17:00:00',
    },
    {
      id: 6,
      storeId: existingStore?.id || 1,
      day: Day.SATURDAY,
      openTime: '07:00:00',
      closeTime: '17:00:00',
    },
    {
      id: 7,
      storeId: existingStore?.id || 1,
      day: Day.SUNDAY,
      openTime: '09:00:00',
      closeTime: '17:00:00',
    },
  ]

  // write to database
  for (const operationalHour of operationalHours) {
    const existingOperationalHour = await prisma.operationalHour.findUnique({
      where: {
        id: operationalHour.id,
      },
    });

    if (!existingOperationalHour) {
      await prisma.operationalHour.create({
        data: operationalHour,
      });
    }
  }

  console.log('Seeder untuk store berhasil dijalankan!');
}


const runSeeder = async () => {
  try {
    await createUsers();
    await createStoreProfile();
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
};

runSeeder();