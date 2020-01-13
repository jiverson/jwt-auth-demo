import { Injectable } from "@angular/core"
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse
} from "@angular/common/http"
import { throwError, Observable, BehaviorSubject, of } from "rxjs"
import { catchError, filter, finalize, take, switchMap, tap } from "rxjs/operators"
import jwtDecode from "jwt-decode"
import { AuthService } from "./auth.service"
import { ApiService } from "./api.service"

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private readonly AUTH_HEADER = "Authorization"
    private accessTokenField = "access_token"
    private refreshTokenInProgress = false
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null)

    constructor(private auth: AuthService, private api: ApiService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log("1 ==============--> intercept", request.url) // DEBUG
        // if (!req.url.includes("auth")) {
        //     return next.handle(req)
        // }

        if (!request.headers.has("Content-Type")) {
            request = request.clone({
                headers: request.headers.set("Content-Type", "application/json")
            })
        }

        request = this.addAuthenticationToken(request)

        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error && error.status === 401) {
                    // 401 errors are most likely going to be because we have an expired token that we need to refresh.
                    if (this.refreshTokenInProgress) {
                        // If refreshTokenInProgress is true, we will wait until refreshTokenSubject has a non-null value
                        // which means the new token is ready and we can retry the request again
                        return this.refreshTokenSubject.pipe(
                            filter(result => result !== null),
                            take(1),
                            switchMap(() => next.handle(this.addAuthenticationToken(request)))
                        )
                    } else {
                        this.refreshTokenInProgress = true

                        // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved
                        this.refreshTokenSubject.next(null)

                        return this.refreshAccessToken().pipe(
                            switchMap((success: boolean) => {
                                this.refreshTokenSubject.next(success)
                                return next.handle(this.addAuthenticationToken(request))
                            }),
                            // When the call to refreshToken completes we reset the refreshTokenInProgress to false
                            // for the next time the token needs to be refreshed
                            finalize(() => (this.refreshTokenInProgress = false))
                        )
                    }
                } else {
                    return throwError(error)
                }
            })
        )
    }

    private refreshAccessToken(): Observable<any> {
        // return of("secret token")
        return this.api.refreshToken().pipe(
            tap(value => {
                console.log("1 --> value", value) // DEBUG
            })
        )
    }

    private isTokenValidOrUndefined(): boolean {
        const token = this.auth.credentials?.access_token

        if (!token) {
            return true
        }

        try {
            const { exp } = jwtDecode(token)
            if (Date.now() >= exp * 1000) {
                return false
            } else {
                return true
            }
        } catch {
            return false
        }
    }

    private addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
        // If we do not have a token yet then we should not set the header.
        // Here we could first retrieve the token from where we store it.
        if (!this.auth.credentials?.access_token) {
            return request
        }

        // If you are calling an outside domain then do not add the token.
        // if (!request.url.match(/www.mydomain.com\//)) {
        //     return request
        // }
        return request.clone({
            headers: request.headers.set(
                this.AUTH_HEADER,
                `Bearer ${this.auth.credentials.access_token}`
            )
        })
    }

    private extractToken = (body: any): string => {
        if (body.data) {
            return body.data[this.accessTokenField]
        }
        return body[this.accessTokenField]
    }
}
