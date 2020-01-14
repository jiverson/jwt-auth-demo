import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import jwtDecode from "jwt-decode"

export interface Credentials {
    access_token: string
    user: {
        id: number
        email: string
    }
}

const credentialsKey = "credentials"

const TO_UNIX = 1000

@Injectable({
    providedIn: "root"
})
export class AuthService {
    private _credentials: Credentials | null = null
    private _tokenExpiresIn: number | null = null

    constructor() {}

    isAuthenticated(): boolean {
        return !!this.credentials
    }

    isTokenExpired(): boolean {
        return Date.now() >= this.tokenExpiresIn
    }

    get credentials(): Credentials | null {
        return this._credentials
    }

    get tokenExpiresIn(): number | null {
        return this._tokenExpiresIn
    }

    setCredentials(credentials?: Credentials, remember?: boolean) {
        this._credentials = credentials || null

        if (!credentials) {
            // sessionStorage.removeItem(credentialsKey);
            // localStorage.removeItem(credentialsKey);
            this._tokenExpiresIn = null
            return
        }

        try {
            const { exp } = jwtDecode(credentials.access_token)
            this._tokenExpiresIn = exp * TO_UNIX
        } catch {
            console.error("could not decode token")
            this._tokenExpiresIn = null
        }

        // const storage = remember ? localStorage : sessionStorage;
        // storage.setItem(credentialsKey, JSON.stringify(credentials));
    }
}
