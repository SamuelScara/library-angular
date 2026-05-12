import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { retry, throwError, timer } from 'rxjs';

const RETRYABLE_STATUSES = [0, 503];

export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method !== 'GET') return next(req);

  return next(req).pipe(
    retry({
      count: 2,
      delay: (error: HttpErrorResponse, attempt) =>
        RETRYABLE_STATUSES.includes(error.status) ? timer(attempt * 1000) : throwError(() => error),
    }),
  );
};
