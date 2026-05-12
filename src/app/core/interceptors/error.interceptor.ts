import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      snackBar.open(toMessage(error), 'OK', { duration: 4000 });
      return throwError(() => error);
    }),
  );
};

function toMessage(error: HttpErrorResponse): string {
  switch (true) {
    case error.status === 0:
      return 'Network error — check your connection';
    case error.status === 400:
      return 'Invalid request';
    case error.status === 404:
      return 'Resource not found';
    case error.status === 409:
      return 'Conflict — resource already exists';
    case error.status >= 500:
      return 'Server error — try again later';
    default:
      return 'An unexpected error occurred';
  }
}
