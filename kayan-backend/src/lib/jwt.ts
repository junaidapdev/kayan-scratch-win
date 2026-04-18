import jwt, { type JwtPayload } from 'jsonwebtoken';
import { env } from '@/config/env';
import { createApiError } from './apiResponse';
import { ERROR_CODES } from '@/constants/errors';
import { HTTP_STATUS } from '@/constants/http';
import type { Request, Response, NextFunction, RequestHandler } from 'express';

const SECRET = env.JWT_SECRET;

export interface TokenPayload {
  customerId?: string; // Opt for pre-registration
  phone: string;
  scope: 'registration' | 'session' | 'scan';
}

export function signRegistrationToken(payload: Pick<TokenPayload, 'phone'>): string {
  return jwt.sign({ ...payload, scope: 'registration' }, SECRET, { expiresIn: '15m' });
}

export function signSessionToken(payload: Omit<TokenPayload, 'scope'>): string {
  return jwt.sign({ ...payload, scope: 'session' }, SECRET, { expiresIn: '90d' });
}

/**
 * Short-lived token issued by POST /visits/scan/lookup for returning customers.
 * Authorizes exactly one subsequent POST /visits/scan call — 5 min TTL means a
 * customer can't reuse an old lookup indefinitely.
 */
export function signScanToken(
  payload: { phone: string; customerId: string },
): string {
  return jwt.sign({ ...payload, scope: 'scan' }, SECRET, { expiresIn: '5m' });
}

export function verifyToken(token: string): TokenPayload {
  try {
    const payload = jwt.verify(token, SECRET) as JwtPayload & TokenPayload;
    return { customerId: payload.customerId, phone: payload.phone, scope: payload.scope };
  } catch (err) {
    throw createApiError(ERROR_CODES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED, {
      message: 'Invalid or expired token',
    });
  }
}

declare global {
  namespace Express {
    interface Request {
      customer?: TokenPayload;
    }
  }
}

export function requireAuth(allowedScopes: TokenPayload['scope'][]): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      next(
        createApiError(ERROR_CODES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED, {
          message: 'Missing or malformed authorization header',
        }),
      );
      return;
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const payload = verifyToken(token);
      
      if (!allowedScopes.includes(payload.scope)) {
        next(
          createApiError(ERROR_CODES.FORBIDDEN, HTTP_STATUS.FORBIDDEN, {
            message: `Insufficient token scope. Required: ${allowedScopes.join(' or ')}`,
          }),
        );
        return;
      }

      req.customer = payload;
      next();
    } catch (err) {
      next(err);
    }
  };
}
