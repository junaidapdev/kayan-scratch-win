export const ERROR_CODES = {
  // Validation
  VALIDATION_FAILED: 'VALIDATION_FAILED',

  // Auth
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_OTP: 'INVALID_OTP',
  OTP_EXPIRED: 'OTP_EXPIRED',

  // Resources
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',

  // Business rules
  STAMP_LOCKOUT_ACTIVE: 'STAMP_LOCKOUT_ACTIVE',
  CARD_ALREADY_REDEEMED: 'CARD_ALREADY_REDEEMED',
  REWARD_EXPIRED: 'REWARD_EXPIRED',

  // Infra
  RATE_LIMITED: 'RATE_LIMITED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export interface BilingualMessage {
  en: string;
  ar: string;
}

export const ERROR_MESSAGES: Record<ErrorCode, BilingualMessage> = {
  [ERROR_CODES.VALIDATION_FAILED]: {
    en: 'One or more fields failed validation.',
    ar: 'فشل التحقق من صحة حقل واحد أو أكثر.',
  },
  [ERROR_CODES.UNAUTHORIZED]: {
    en: 'Authentication required.',
    ar: 'المصادقة مطلوبة.',
  },
  [ERROR_CODES.FORBIDDEN]: {
    en: 'You do not have permission to perform this action.',
    ar: 'ليس لديك إذن لتنفيذ هذا الإجراء.',
  },
  [ERROR_CODES.INVALID_OTP]: {
    en: 'The verification code is incorrect.',
    ar: 'رمز التحقق غير صحيح.',
  },
  [ERROR_CODES.OTP_EXPIRED]: {
    en: 'The verification code has expired.',
    ar: 'انتهت صلاحية رمز التحقق.',
  },
  [ERROR_CODES.NOT_FOUND]: {
    en: 'The requested resource was not found.',
    ar: 'المورد المطلوب غير موجود.',
  },
  [ERROR_CODES.CONFLICT]: {
    en: 'The request conflicts with the current state of the resource.',
    ar: 'الطلب يتعارض مع الحالة الحالية للمورد.',
  },
  [ERROR_CODES.STAMP_LOCKOUT_ACTIVE]: {
    en: 'A stamp was already recorded within the lockout window.',
    ar: 'تم تسجيل ختم بالفعل خلال فترة الإغلاق.',
  },
  [ERROR_CODES.CARD_ALREADY_REDEEMED]: {
    en: 'This loyalty card has already been redeemed.',
    ar: 'تم استبدال بطاقة الولاء هذه بالفعل.',
  },
  [ERROR_CODES.REWARD_EXPIRED]: {
    en: 'This reward has expired.',
    ar: 'انتهت صلاحية هذه المكافأة.',
  },
  [ERROR_CODES.RATE_LIMITED]: {
    en: 'Too many requests. Please try again later.',
    ar: 'عدد الطلبات كثير جداً. الرجاء المحاولة لاحقاً.',
  },
  [ERROR_CODES.INTERNAL_ERROR]: {
    en: 'An unexpected error occurred.',
    ar: 'حدث خطأ غير متوقع.',
  },
};
