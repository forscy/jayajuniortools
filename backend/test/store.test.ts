// import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, it} from '@jest/globals';
// // backend/src/test/store.test.ts
// import request from 'supertest';
// import app from '../src/index';

// describe('Store API', () => {
//   let token: string;

//   beforeAll(async () => {
//     // Setup token untuk Owner role
//     const user = await request(app)
//       .post('/api/auth/signup')
//       .send({
//         name: 'Owner User',
//         email: 'owner@example.com',
//         password: 'password123',
//         role: 'OWNER',
//       });

//     const loginResponse = await request(app)
//       .post('/api/auth/signin')
//       .send({ email: 'owner@example.com', password: 'password123' });

//     token = loginResponse.body.data.token; // Assuming response structure has token
//   });

//   it('should update store information successfully', async () => {
//     const storeData = {
//       storeId: 1,  // Store yang valid, sesuaikan dengan data yang ada di database
//       name: 'Updated Store Name',
//       address: 'New Address, City, Province',
//       phone: '+123456789',
//       email: 'newemail@example.com',
//       description: 'Updated store description.',
//     };

//     const response = await request(app)
//       .put('/api/store/update-store')
//       .set('Authorization', `Bearer ${token}`)
//       .send(storeData);

//     expect(response.status).toBe(200);
//     expect(response.body.status).toBe('success');
//     expect(response.body.message).toBe('Store information updated successfully');
//   });

//   it('should not allow non-Owner to update store information', async () => {
//     // Simulate login with non-Owner role
//     const nonOwnerToken = await request(app)
//       .post('/api/auth/signin')
//       .send({ email: 'nonowner@example.com', password: 'password123' })
//       .then(res => res.body.data.token);

//     const storeData = {
//       storeId: 1,
//       name: 'Unauthorized Update',
//       address: 'Some Address',
//       phone: '+987654321',
//       email: 'unauthorized@example.com',
//       description: 'This should not be allowed',
//     };

//     const response = await request(app)
//       .put('/api/store/update-store')
//       .set('Authorization', `Bearer ${nonOwnerToken}`)
//       .send(storeData);

//     expect(response.status).toBe(403);
//     expect(response.body.status).toBe('error');
//     expect(response.body.message).toBe('You must be an Owner to perform this action');
//   });

//   it('should return error if storeId not found', async () => {
//     const storeData = {
//       storeId: 9999,  // Store ID yang tidak ada
//       name: 'Non-existing Store',
//       address: 'Some Address',
//       phone: '+111111111',
//       email: 'nonexisting@example.com',
//       description: 'This store does not exist',
//     };

//     const response = await request(app)
//       .put('/api/store/update-store')
//       .set('Authorization', `Bearer ${token}`)
//       .send(storeData);

//     expect(response.status).toBe(400);
//     expect(response.body.status).toBe('error');
//     expect(response.body.message).toBe('Store not found');
//   });

//   it('should return error if email format is invalid', async () => {
//     const storeData = {
//       storeId: 1,
//       name: 'Invalid Email Store',
//       address: 'Some Address',
//       phone: '+222222222',
//       email: 'invalid-email',  // Format email yang salah
//       description: 'Invalid email format should return error',
//     };

//     const response = await request(app)
//       .put('/api/store/update-store')
//       .set('Authorization', `Bearer ${token}`)
//       .send(storeData);

//     expect(response.status).toBe(400);
//     expect(response.body.status).toBe('error');
//     expect(response.body.message).toBe('Invalid email format');
//   });
// });
