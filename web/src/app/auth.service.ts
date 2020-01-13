import { Injectable } from "@angular/core"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { Observable } from "rxjs"
import { tap } from "rxjs/operators"

export interface Credentials {
    access_token: string
    user: {
        id: number
        email: string
    }
}

@Injectable({
    providedIn: "root"
})
export class AuthService {
    private _credentials: Credentials | null = null

    constructor(private http: HttpClient) {}

    isAuthenticated(): boolean {
        return !!this.credentials
    }

    get credentials(): Credentials | null {
        return this._credentials
    }

    setCredentials(credentials?: Credentials, remember?: boolean) {
        this._credentials = credentials || null

        if (credentials) {
            // const storage = remember ? localStorage : sessionStorage;
            // storage.setItem(credentialsKey, JSON.stringify(credentials));
        } else {
            // sessionStorage.removeItem(credentialsKey);
            // localStorage.removeItem(credentialsKey);
        }
    }
}
