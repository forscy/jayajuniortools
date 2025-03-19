// src/controllers/store.controller.ts
import { Request, Response } from 'express';
import * as storeService from '../services/store.service';
import { sendResponse } from '../utils/responseWrapper';

// Get store information
export const getStore = async (req: Request, res: Response) => {
  try {
    const store = await storeService.getStoreService();
    return sendResponse(res, 200, 'success', 'Store information retrieved successfully', store);
  } catch (error: any) {
    return sendResponse(res, 400, 'error', error.message);
  }
};

export const updateStore = async (req: Request, res: Response) => {
  const { storeId, name, address, phone, email, description } = req.body;

  try {
    const result = await storeService.updateStoreService({
      storeId,
      name,
      address,
      phone,
      email,
      description,
    });

    return sendResponse(res, 200, 'success', result.message, result.store );
  } catch (error: any) {
    return sendResponse(res, 400, 'error', error.message);
  }
};
