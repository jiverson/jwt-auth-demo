import { Injectable } from "@angular/core"

// Customize received credentials here
export interface Credentials {
    access_token: string
    expiresIn: number
    user: {
        id: number
        email: string
    }
}

const credentialsKey = "credentials"

@Injectable({
    providedIn: "root"
})
export class CredentialsService {
    private _credentials: Credentials | null = null

    constructor() {
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

        const exp = Date.now() >= expiresIn * 1000
        return !exp
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
}
