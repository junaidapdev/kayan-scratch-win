import type { Request, Response, NextFunction } from 'express';
import { logger } from '@/lib/logger';

const PHONE_REGEX = /(\+?9665|05)(\d{5})(\d{3})/g;

function maskData(data: unknown): unknown {
  if (typeof data === 'string') {
    return data.replace(PHONE_REGEX, '$1XXXXX$3');
  }
  if (Array.isArray(data)) {
    return data.map(maskData);
  }
  if (data !== null && typeof data === 'object') {
    const maskedObj: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      maskedObj[key] = maskData(value);
    }
    return maskedObj;
  }
  return data;
}

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  const maskedBody = req.body ? maskData(req.body) : undefined;
  const maskedUrl = req.originalUrl ? String(maskData(req.originalUrl)) : req.url;

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('HTTP Request', {
      method: req.method,
      path: maskedUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      body: maskedBody,
    });
  });

  next();
}
