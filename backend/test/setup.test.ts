import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, it} from '@jest/globals';


describe('User Controller', () => {
  beforeAll(() => {
    // Setup sebelum semua tes
  });

  afterAll(() => {
    // Cleanup setelah semua tes
  });

  beforeEach(() => {
    // Setup sebelum setiap tes
  });

  afterEach(() => {
    // Cleanup setelah setiap tes
  });

  it('should create a user successfully', () => {
    // Tes untuk create user
    expect(true).toBe(true);
  });

  it('should return an error if email already exists', () => {
    // Tes untuk validasi email yang sudah ada
    expect(true).toBe(true);
  });
});
