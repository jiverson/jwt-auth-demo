import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import { tap } from "rxjs/operators"

import { environment } from "../environments/environment"
import { skipTokenHeader } from "./http-headers"
import jwtDecode from "jwt-decode"

// Customize received credentials here
export interface Credentials {
    access_token: string
    user: {
        id: number
        email: string
    }
}

export const isExpired = (n: number) => Date.now() >= n * 1000
export const credentialsKey = "credentials"

@Injectable({
    providedIn: "root"
})
export class CredentialsService {
    private readonly baseUrl: string
    private expiresIn: number | null = null
    private _credentials: Credentials | null = null

    constructor(private http: HttpClient) {
        this.baseUrl = environment.auth_url

        const savedCredentials =
            sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey)
        if (savedCredentials) {
            this._credentials = JSON.parse(savedCredentials)
            const { exp } = jwtDecode(this._credentials.access_token)
            this.expiresIn = exp
        }
    }

    get credentials(): Credentials | null {
        return this._credentials
    }

    get token(): string | null {
        return this.credentials?.access_token
    }

    isTokenExpired(): boolean {
        return isExpired(this.expiresIn)
    }

    isAuthenticated(): boolean {
        return !!this.credentials
    }

    setCredentials(credentials?: Credentials, remember = false) {
        this._credentials = credentials || null

        if (!credentials) {
            this.expiresIn = null
            sessionStorage.removeItem(credentialsKey)
            localStorage.removeItem(credentialsKey)
            return
        }

        const { exp } = jwtDecode(credentials.access_token)
        this.expiresIn = exp

        const storage = remember ? localStorage : sessionStorage
        storage.setItem(credentialsKey, JSON.stringify(credentials))
    }

    refreshToken(): Observable<Credentials> {
        return this.http
            .post<Credentials>(
                `${this.baseUrl}/refresh_token`,
                {},
                { headers: skipTokenHeader, withCredentials: true }
            )
            .pipe(tap(data => this.setCredentials(data, true)))
    }
}
