import { HttpInterceptorFn } from '@angular/common/http';

// Adds withCredentials: true at every HTTP request
export const credentialInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req.clone({ withCredentials: true }));
};
