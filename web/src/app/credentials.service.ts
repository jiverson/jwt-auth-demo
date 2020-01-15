import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import { tap } from "rxjs/operators"

import { environment } from "../environments/environment"
import { skipTokenHeader } from "./http-headers"

// Customize received credentials here
export interface Credentials {
    access_token: string
    expiresIn: number
    user: {
        id: number
        email: string
    }
}

export const isExpired = x => Date.now() >= x * 1000
export const credentialsKey = "credentials"

@Injectable({
    providedIn: "root"
})
export class CredentialsService {
    private readonly baseUrl: string
    private _credentials: Credentials | null = null

    constructor(private http: HttpClient) {
        this.baseUrl = environment.auth_url
        const savedCredentials =
            sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey)
        if (savedCredentials) {
            this._credentials = JSON.parse(savedCredentials)
        }
    }

    get credentials(): Credentials | null {
        return this._credentials
    }

    isAuthenticated(): boolean {
        return !!this.credentials
    }

    isTokenValidOrUndefined(): boolean {
        const token = this.credentials?.access_token
        const expiresIn = this.credentials?.expiresIn

        if (!token || !expiresIn) {
            return true
        }

        return !isExpired(expiresIn)
    }

    setCredentials(credentials?: Credentials, remember = true) {
        this._credentials = credentials || null

        if (!credentials) {
            sessionStorage.removeItem(credentialsKey)
            localStorage.removeItem(credentialsKey)
            return
        }

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
            .pipe(tap(data => this.setCredentials(data)))
    }
}
