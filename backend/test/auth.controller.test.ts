// import request from 'supertest';
// import app from '../src/index'; // Pastikan ini mengarah ke file app.ts yang berisi setup Express
// import { prisma } from '../src/config/client';
// import {afterAll, beforeAll, describe, expect, it, test} from '@jest/globals';


// describe('Suspend Account Tests', () => {

//   let ownerToken: string;
//   let userToken: string;
//   let userId: number;

//   beforeAll(async () => {
//     // Setup: Tambahkan pengguna Owner dan User untuk pengujian
//     const owner = await prisma.user.create({
//       data: {
//         name: 'Owner User',
//         email: 'owner@example.com',
//         password: 'ownerPassword',
//       },
//     });

//     const user = await prisma.user.create({
//       data: {
//         name: 'Normal User',
//         email: 'user@example.com',
//         password: 'userPassword',
//       },
//     });

//     userId = user.id;

//     // Simulasi login untuk mendapatkan JWT token
//     const ownerResponse = await request(app)
//       .post('/api/auth/signin')
//       .send({ email: 'owner@example.com', password: 'ownerPassword' });
//     ownerToken = ownerResponse.body.token; // Pastikan kamu mendapatkan token

//     const userResponse = await request(app)
//       .post('/api/auth/signin')
//       .send({ email: 'user@example.com', password: 'userPassword' });
//     userToken = userResponse.body.token; // Pastikan kamu mendapatkan token
//   });

//   it('should allow Owner to suspend a user account', async () => {
//     const response = await request(app)
//       .post('/api/auth/suspend-account')
//       .set('Authorization', `Bearer ${ownerToken}`) // Menggunakan token Owner
//       .send({ userId })
//       .expect('Content-Type', /json/)
//       .expect(200);

//     expect(response.body.status).toBe('success');
//     expect(response.body.message).toBe('User suspended successfully');
//     expect(response.body.data.userId).toBe(userId);

//     // Memastikan status user sudah diubah menjadi SUSPENDED
//     const suspendedUser = await prisma.user.findUnique({ where: { id: userId } });
//     expect(suspendedUser?.status).toBe('SUSPENDED');
//   });

//   it('should not allow non-Owner to suspend a user account', async () => {
//     const response = await request(app)
//       .post('/api/auth/suspend-account')
//       .set('Authorization', `Bearer ${userToken}`) // Menggunakan token User biasa
//       .send({ userId })
//       .expect('Content-Type', /json/)
//       .expect(403); // Harusnya error karena hanya Owner yang bisa melakukannya

//     expect(response.body.status).toBe('error');
//     expect(response.body.message).toBe('You must be an Owner to perform this action');
//   });

//   it('should return error if userId is invalid', async () => {
//     const invalidUserId = 9999; // ID user yang tidak ada di database

//     const response = await request(app)
//       .post('/api/auth/suspend-account')
//       .set('Authorization', `Bearer ${ownerToken}`)
//       .send({ userId: invalidUserId })
//       .expect('Content-Type', /json/)
//       .expect(400); // Harusnya error jika user tidak ditemukan

//     expect(response.body.status).toBe('error');
//     expect(response.body.message).toBe('User not found');
//   });

//   afterAll(async () => {
//     // Cleanup: Hapus data setelah test selesai
//     await prisma.user.deleteMany(); // Menghapus semua pengguna yang dibuat selama pengujian
//   });
// });