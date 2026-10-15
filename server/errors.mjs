export class AppError extends Error {
  constructor(status, code, message, retryAfter) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
    this.retryAfter = retryAfter;
  }
}

export function publicError(error) {
  if (error instanceof AppError) return error;
  return new AppError(500, 'INTERNAL_ERROR', 'خطایی در سرور رخ داد. لطفاً کمی بعد دوباره تلاش کنید.');
}
