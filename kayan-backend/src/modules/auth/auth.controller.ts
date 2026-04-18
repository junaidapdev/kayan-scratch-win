import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';
import { signRegistrationToken } from '@/lib/jwt';
import { smsProvider } from '@/lib/sms';
import { apiSuccess, createApiError } from '@/lib/apiResponse';
import { HTTP_STATUS } from '@/constants/http';
import { ERROR_CODES, type ErrorCode } from '@/constants/errors';
import type { OtpRequestPayload } from '@/interfaces/auth/OtpRequestPayload';
import type { OtpVerifyPayload } from '@/interfaces/auth/OtpVerifyPayload';
import { OTP_EXPIRY_SECONDS, OTP_LENGTH } from '@/constants/business';

export async function requestOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { phone } = req.body as OtpRequestPayload;

    // Rate-limit check: up to 3 inside 10 minutes
    const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count, error: countError } = await supabaseAdmin
      .from('otp_tokens')
      .select('*', { count: 'exact', head: true })
      .eq('phone', phone)
      .gte('created_at', tenMinsAgo);

    if (countError) throw countError;

    if (count !== null && count >= 3) {
      throw createApiError(ERROR_CODES.OTP_RATE_LIMIT, HTTP_STATUS.TOO_MANY_REQUESTS, {
        message: 'Maximum OTP requests reached for this phone number. Try again later.',
      });
    }

    // Generate numeric OTP
    let otp = '';
    for (let i = 0; i < OTP_LENGTH; i++) {
      otp += crypto.randomInt(0, 10).toString();
    }

    // Hash it for DB via bcrypt
    const saltRounds = 10;
    const tokenHash = await bcrypt.hash(otp, saltRounds);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_SECONDS * 1000).toISOString();

    // Store in DB
    const { error: insertError } = await supabaseAdmin.from('otp_tokens').insert({
      phone,
      token_hash: tokenHash,
      expires_at: expiresAt,
    });

    if (insertError) throw insertError;

    // Send SMS
    const body = `Your Kayan Sweets verification code is: ${otp}`;
    await smsProvider.send(phone, body);
    
    // Log to sms_log
    await supabaseAdmin.from('sms_log').insert({
      phone,
      purpose: 'otp',
      status: 'sent',
    });

    res.json(apiSuccess({ message: 'OTP requested successfully' }));
  } catch (err) {
    next(err);
  }
}

export async function verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { phone, otp } = req.body as OtpVerifyPayload;

    const { data, error } = await supabaseAdmin.rpc('verify_otp', {
      p_phone: phone,
      p_otp: otp,
    });

    if (error) {
      throw createApiError(ERROR_CODES.INTERNAL_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR, {
        message: 'RPC Error during OTP verification',
        details: error.message,
      });
    }

    if (!data.success) {
      const code = data.reason as string;
      const status = code === 'OTP_RATE_LIMIT' ? HTTP_STATUS.TOO_MANY_REQUESTS : HTTP_STATUS.UNAUTHORIZED;
      throw createApiError(code as ErrorCode, status, {
        message: 'OTP verification failed',
      });
    }

    // Success! Generate Registration Token
    const token = signRegistrationToken({ phone });

    res.json(apiSuccess({ token, scope: 'registration' }));
  } catch (err) {
    next(err);
  }
}
