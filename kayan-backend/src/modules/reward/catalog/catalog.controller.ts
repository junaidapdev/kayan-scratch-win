import type { Request, Response, NextFunction } from 'express';
import { apiSuccess } from '@/lib/apiResponse';
import { HTTP_STATUS } from '@/constants/http';
import type {
  CatalogCreatePayload,
  CatalogUpdatePayload,
  CatalogStatus,
} from '@/interfaces/reward';
import {
  listCatalog,
  createCatalogItem,
  updateCatalogItem,
  setCatalogStatus,
} from './catalog.service';

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const status = (req.query.status as CatalogStatus | undefined) ?? undefined;
    const rows = await listCatalog(status);
    res.json(apiSuccess(rows));
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const created = await createCatalogItem(req.body as CatalogCreatePayload);
    res.status(HTTP_STATUS.CREATED).json(apiSuccess(created));
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const updated = await updateCatalogItem(req.params.id, req.body as CatalogUpdatePayload);
    res.json(apiSuccess(updated));
  } catch (err) {
    next(err);
  }
}

export async function pause(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const updated = await setCatalogStatus(req.params.id, 'paused');
    res.json(apiSuccess(updated));
  } catch (err) {
    next(err);
  }
}

export async function resume(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const updated = await setCatalogStatus(req.params.id, 'active');
    res.json(apiSuccess(updated));
  } catch (err) {
    next(err);
  }
}

export async function archive(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const updated = await setCatalogStatus(req.params.id, 'archived');
    res.json(apiSuccess(updated));
  } catch (err) {
    next(err);
  }
}
