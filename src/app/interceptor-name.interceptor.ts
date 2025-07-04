import { Inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class InterceptorNameInterceptor implements HttpInterceptor {
  constructor(@Inject(NgxSpinnerService) private _spinner: NgxSpinnerService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this._spinner.show();

    return next.handle(request).pipe(
      finalize(() => {
        this._spinner.hide();
      })
    );
  }
}
