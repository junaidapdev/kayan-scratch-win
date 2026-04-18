export const TOAST_DURATION_MS = 4000;
export const OTP_LENGTH = 4;
export const OTP_RESEND_COOLDOWN_SECONDS = 30;

export const DEBOUNCE_INPUT_MS = 300;
export const API_TIMEOUT_MS = 15000;

export const STAMPS_PER_CARD = 10;

export const AUTH_TOKEN_STORAGE_KEY = 'kayan.auth.token';
export const LANGUAGE_STORAGE_KEY = 'kayan.i18n.lang';

export const SUPPORTED_LANGUAGES = ['en', 'ar'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export const DEFAULT_LANGUAGE: SupportedLanguage = 'ar';
