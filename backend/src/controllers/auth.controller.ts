// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { sendResponse } from '../utils/responseWrapper';

export const signUp = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const result = await authService.signUpService(name, email, password);
    return sendResponse(res, 201, 'success', result.message, { userId: result.userId });
  } catch (error: any) {
    return sendResponse(res, 400, 'error', error.message);
  }
};

export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await authService.signInService(email, password);
    return sendResponse(res, 200, 'success', result.message, { token: result.token });
  } catch (error: any) {
    return sendResponse(res, 400, 'error', error.message);
  }
};
