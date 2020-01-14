import { Injectable } from "@angular/core"
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from "@angular/common/http"
import { Observable, BehaviorSubject } from "rxjs"
import { filter, finalize, take, switchMap, map } from "rxjs/operators"

import { AuthService, Credentials } from "./auth.service"
import { ApiService } from "./api.service"

const AUTH_URL = "refresh_token"
const AUTH_HEADER = "Authorization"

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private refreshTokenInProgress = false
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null)

    constructor(private auth: AuthService, private api: ApiService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (request.url.includes(AUTH_URL)) {
            return next.handle(request)
        }

        // if (!request.headers.has("Content-Type")) {
        //     request = request.clone({
        //         headers: request.headers.set("Content-Type", "application/json")
        //     })
        // }

        request = this.addAuthenticationToken(request)

        if (this.isTokenValidOrUndefined()) {
            return next.handle(request)
        }

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
                switchMap(data => {
                    this.auth.setCredentials(data)
                    this.refreshTokenSubject.next(data)
                    return next.handle(this.addAuthenticationToken(request))
                }),
                // When the call to refreshToken completes we reset the refreshTokenInProgress to false
                // for the next time the token needs to be refreshed
                finalize(() => (this.refreshTokenInProgress = false))
            )
        }
    }

    private refreshAccessToken(): Observable<Credentials> {
        return this.api.refreshToken<Credentials>()
    }

    private isTokenValidOrUndefined(): boolean {
        const token = this.auth.credentials?.access_token

        if (!token) {
            return true
        }

        return !this.auth.isTokenExpired()
    }

    private addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
        const token = this.auth.credentials?.access_token
        // If we do not have a token yet then we should not set the header.
        // Here we could first retrieve the token from where we store it.
        if (!token) {
            return request
        }

        return request.clone({
            headers: request.headers.set(AUTH_HEADER, `Bearer ${token}`)
        })
    }
}
