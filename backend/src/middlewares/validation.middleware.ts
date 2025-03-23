import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { sendResponse } from "../utils/responseWrapper";

// Generic validation middleware
const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return sendResponse(res, 400, "error", errorMessage);
    }
    
    next();
  };
};

// Product validation schema
const productSchema = Joi.object({
  name: Joi.string().required().trim().min(3).max(100),
  description: Joi.string().allow('', null),
  retailPrice: Joi.number().required().min(0),
  wholesalePrice: Joi.number().min(0),
  minWholesaleQty: Joi.number().integer().min(1),
  sku: Joi.string().allow('', null),
  categories: Joi.array().items(Joi.number().integer()),
  images: Joi.array().items(Joi.string().uri()),
  quantityInStock: Joi.number().integer().required().min(0),
  minimumStock: Joi.number().integer().min(0)
});

// Auth validation schemas
const signUpSchema = Joi.object({
  name: Joi.string().required().trim().min(2).max(50),
  email: Joi.string().required().email(),
  password: Joi.string().required().min(6).max(30)
});

const signInSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required()
});

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required().min(6).max(30)
});

const createAccountSchema = Joi.object({
  name: Joi.string().required().trim().min(2).max(50),
  email: Joi.string().required().email(),
  password: Joi.string().required().min(6).max(30),
  role: Joi.string().required().valid('OWNER', 'SHOPKEEPER', 'INVENTORY_MANAGER', 'BUYER')
});

const suspendAccountSchema = Joi.object({
  email: Joi.string().required().email()
});

// Export validation middlewares
export const validateProductInput = validate(productSchema);
export const validateSignUp = validate(signUpSchema);
export const validateSignIn = validate(signInSchema);
export const validateChangePassword = validate(changePasswordSchema);
export const validateCreateAccount = validate(createAccountSchema);
export const validateSuspendAccount = validate(suspendAccountSchema);

// Use the same schema for delete account
export const validateDeleteAccount = validate(suspendAccountSchema);

export const validateEditAccount = validate(Joi.object({
  email: Joi.string().required().email(),
  name: Joi.string().trim().min(2).max(50),
  role: Joi.string().valid('OWNER', 'SHOPKEEPER', 'INVENTORY_MANAGER', 'BUYER'),
  status: Joi.string().valid('ACTIVE', 'SUSPENDED', 'DELETED')
}));