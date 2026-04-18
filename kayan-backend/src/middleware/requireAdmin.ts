import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { env } from '@/config/env';
import { logger } from '@/lib/logger';
import { createApiError } from '@/lib/apiResponse';
import { ERROR_CODES } from '@/constants/errors';
import { HTTP_STATUS } from '@/constants/http';

const ADMIN_KEY_HEADER = 'x-admin-key';

let warned = false;

/**
 * TEMPORARY admin auth until Chunk 6 builds the real admin module.
 *
 * Checks the `X-Admin-Key` header against env.ADMIN_PLACEHOLDER_KEY. This is
 * deliberately a shared-secret header — no per-user identity, no session, no
 * revocation. DO NOT ship to production without replacing this.
 */
export function requireAdmin(): RequestHandler {
  if (!warned) {
    logger.warn(
      'requireAdmin middleware is using the ADMIN_PLACEHOLDER_KEY shared secret. Replace with real admin auth before production (Chunk 6).',
    );
    warned = true;
  }

  return (req: Request, _res: Response, next: NextFunction): void => {
    const provided = req.header(ADMIN_KEY_HEADER);
    if (!provided || provided !== env.ADMIN_PLACEHOLDER_KEY) {
      next(
        createApiError(ERROR_CODES.ADMIN_AUTH_REQUIRED, HTTP_STATUS.UNAUTHORIZED, {
          message: 'Missing or invalid admin key header',
        }),
      );
      return;
    }
    next();
  };
}
