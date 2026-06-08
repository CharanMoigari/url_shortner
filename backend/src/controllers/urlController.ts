// URL controller

import { Request, Response, NextFunction } from 'express';
import URLService from '../services/URLService';
import { validate } from '../validations/schemas';
import { createURLSchema, paginationSchema } from '../validations/schemas';
import { sendResponse } from '../utils';

export const createURL = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error, value } = validate(req.body, createURLSchema);
    if (error) {
      return sendResponse(res, 400, null, error);
    }

    const url = await URLService.createURL(
      req.userId!,
      value.originalUrl,
      value.customAlias,
      value.expiresAt
    );

    sendResponse(res, 201, url, 'Short URL created successfully');
  } catch (error) {
    next(error);
  }
};

export const getUserURLs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error, value } = validate(
      {
        page: req.query.page,
        limit: req.query.limit,
      },
      paginationSchema
    );

    if (error) {
      return sendResponse(res, 400, null, error);
    }

    const result = await URLService.getUserURLs(
      req.userId!,
      String(value.page),
      String(value.limit),
      req.query.search as string,
      req.query.sort as string
    );

    sendResponse(res, 200, result, 'URLs retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getURLById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const url = await URLService.getURLById(req.params.id, req.userId!);

    sendResponse(res, 200, url, 'URL retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteURL = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await URLService.deleteURL(req.params.id, req.userId!);

    sendResponse(res, 200, result, 'URL deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const updateURL = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return sendResponse(res, 400, null, 'Original URL is required');
    }

    const url = await URLService.updateURL(
      req.params.id,
      req.userId!,
      originalUrl
    );

    sendResponse(res, 200, url, 'URL updated successfully');
  } catch (error) {
    next(error);
  }
};

export default {
  createURL,
  getUserURLs,
  getURLById,
  deleteURL,
  updateURL,
};
