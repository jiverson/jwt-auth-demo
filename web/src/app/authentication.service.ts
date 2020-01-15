import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import { tap } from "rxjs/operators"

import { CredentialsService, Credentials } from "./credentials.service"
import { skipTokenHeader } from "./http-headers"
import { environment } from "../environments/environment"

export interface LoginContext {
    email: string
    password: string
    remember?: boolean
}

export interface RegisterContext extends LoginContext {
    username: string
}

@Injectable({
    providedIn: "root"
})
export class AuthenticationService {
    private readonly baseUrl: string

    constructor(private http: HttpClient, private creds: CredentialsService) {
        this.baseUrl = environment.auth_url
    }

    register<T>(context: RegisterContext): Observable<T> {
        return this.http.post<T>(`${this.baseUrl}/register`, context, {
            headers: skipTokenHeader
        })
    }

    login(context: LoginContext): Observable<Credentials> {
        return this.http
            .post<Credentials>(`${this.baseUrl}/login`, context, {
                headers: skipTokenHeader
            })
            .pipe(tap(data => this.creds.setCredentials(data, context.remember)))
    }

    logout(): Observable<boolean> {
        const context = this.creds.credentials?.user ?? {}
        this.creds.setCredentials()
        return this.http.post<boolean>(`${this.baseUrl}/logout`, context, {
            headers: skipTokenHeader
        })
    }
}
