// Authentication controller

import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/AuthService';
import { validate } from '../validations/schemas';
import { loginSchema, registerSchema } from '../validations/schemas';
import { sendResponse } from '../utils';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error, value } = validate(req.body, registerSchema);
    if (error) {
      return sendResponse(res, 400, null, error);
    }

    const result = await AuthService.register(value.email, value.password);

    sendResponse(res, 201, result, 'Registration successful');
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error, value } = validate(req.body, loginSchema);
    if (error) {
      return sendResponse(res, 400, null, error);
    }

    const result = await AuthService.login(value.email, value.password);

    sendResponse(res, 200, result, 'Login successful');
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return sendResponse(res, 400, null, 'Refresh token required');
    }

    const result = await AuthService.refreshToken(refreshToken);

    sendResponse(res, 200, result, 'Token refreshed successfully');
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  refreshToken,
};
