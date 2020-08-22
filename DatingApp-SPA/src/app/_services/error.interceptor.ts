import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(req).pipe(
            catchError(err => {
                if (err.status === 401) {
                    return throwError(err.statusText);
                }

                if (err instanceof HttpErrorResponse) {
                    // Handling 500 Error
                    const applicationError = err.headers.get('Application-Error');
                    if (applicationError) {
                        return throwError(applicationError);
                    }

                    // Handling Validation Errors or ModelState Error
                    const serverError = err.error;
                    let modelStateError = "";

                    if (serverError.errors && typeof serverError.errors == 'object') {
                        for (const key in serverError.errors) {
                            if (serverError.errors[key]) {
                                modelStateError += serverError.errors[key] + "\n";
                            }
                        }
                    }
                    // Throw modelstateerror if not empty else serverError. If both doesnt exist we just say server error
                    return throwError(modelStateError || serverError || 'Server Error');
                }
            })
        )
    }


}

// provide in app.module.ts
export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
};