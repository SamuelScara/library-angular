import { Injectable } from '@angular/core';
import { asyncScheduler, BehaviorSubject } from 'rxjs';
import { observeOn } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private count = 0;
  private readonly _isLoading$ = new BehaviorSubject<boolean>(false);
  readonly isLoading$ = this._isLoading$.pipe(observeOn(asyncScheduler));

  start(): void {
    if (++this.count === 1) this._isLoading$.next(true);
  }

  stop(): void {
    if (--this.count <= 0) {
      this.count = 0;
      this._isLoading$.next(false);
    }
  }
}
