import { Injectable } from "@angular/core"
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from "@angular/common/http"
import { Observable, BehaviorSubject } from "rxjs"
import { filter, finalize, take, switchMap } from "rxjs/operators"

import { CredentialsService } from "./credentials.service"
import { SKIP_TOKEN, authorizationHeader } from "./http-headers"

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    private refreshTokenInProgress = false
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null)

    constructor(private creds: CredentialsService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Allow ignore certain requests ie refreshToken
        if (request.headers.has(SKIP_TOKEN)) {
            const headers = request.headers.delete(SKIP_TOKEN)
            return next.handle(request.clone({ headers }))
        }

        // If we do not have a token do not add
        if (this.creds.isTokenValidOrUndefined()) {
            request = this.addAuthenticationToken(request)
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

            return this.creds.refreshToken().pipe(
                switchMap(data => {
                    this.refreshTokenSubject.next(data)
                    return next.handle(this.addAuthenticationToken(request))
                }),
                // When the call to refreshToken completes reset the refreshTokenInProgress to false
                // for the next time the token needs to be refreshed
                finalize(() => (this.refreshTokenInProgress = false))
            )
        }
    }

    private addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
        if (!this.creds.isTokenValidOrUndefined()) {
            return request
        }

        const token = this.creds.credentials?.access_token

        return authorizationHeader(request, token)
    }
}
