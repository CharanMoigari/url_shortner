// Authentication service

import jwt from 'jsonwebtoken';
import { config } from '../config';
import { UserRepository } from '../repositories/UserRepository';
import {
  AuthenticationError,
  ConflictError,
} from '../utils/errors';
import { JWTPayload } from '../types';
import logger from '../config/logger';

export const AuthService = {
  async register(email: string, password: string) {
    // Check if user already exists
    const exists = await UserRepository.emailExists(email);
    if (exists) {
      throw new ConflictError('Email already registered');
    }

    // Create user
    const user = await UserRepository.create(email, password);

    logger.info(`New user registered: ${email}`);

    // Generate tokens
    const { accessToken, refreshToken } = this.generateTokens(
      user.id,
      user.email
    );

    return {
      user: {
        id: user.id,
        email: user.email,
      },
      accessToken,
      refreshToken,
    };
  },

  async login(email: string, password: string) {
    // Find user
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    // Verify password
    const isValid = await UserRepository.verifyPassword(
      user.password_hash,
      password
    );
    if (!isValid) {
      throw new AuthenticationError('Invalid credentials');
    }

    logger.info(`User logged in: ${email}`);

    // Generate tokens
    const { accessToken, refreshToken } = this.generateTokens(
      user.id,
      user.email
    );

    return {
      user: {
        id: user.id,
        email: user.email,
      },
      accessToken,
      refreshToken,
    };
  },

  generateTokens(userId: string, email: string) {
    const accessToken = jwt.sign(
      {
        userId,
        email,
      } as JWTPayload,
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn as string } as any
    );

    const refreshToken = jwt.sign(
      {
        userId,
        email,
      } as JWTPayload,
      config.jwt.secret,
      { expiresIn: config.jwt.refreshExpiresIn as string } as any
    );

    return { accessToken, refreshToken };
  },

  async refreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
      const { accessToken, refreshToken } = this.generateTokens(
        decoded.userId,
        decoded.email
      );

      return { accessToken, refreshToken };
    } catch (error) {
      throw new AuthenticationError('Invalid refresh token');
    }
  },
};

export default AuthService;
