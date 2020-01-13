import { Injectable } from "@angular/core"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { Observable, of } from "rxjs"
import { tap } from "rxjs/operators"

const baseUrl = "api"

export interface LoginContext {
    email: string
    password: string
}

export interface RegisterContext extends LoginContext {}

@Injectable({
    providedIn: "root"
})
export class ApiService {
    constructor(private http: HttpClient) {}

    helloWorld(): Observable<any> {
        return this.http.get(baseUrl, { responseType: "text" })
    }

    register<T>(context: RegisterContext): Observable<T> {
        return this.http.post<T>(`${baseUrl}/register`, context)
    }

    login<T>(context: LoginContext): Observable<T> {
        return this.http.post<T>(`${baseUrl}/login`, context)
    }

    logout(): Observable<any> {
        return of("logout")
        // return this.http.post(`${baseUrl}/logout`, this.httpOptions)
    }

    whoami(): Observable<any> {
        return this.http.get(`${baseUrl}/whoami`)
    }

    profile(): Observable<any> {
        return this.http.get(`${baseUrl}/profile`)
    }

    refreshToken(): Observable<any> {
        return this.http.get(`${baseUrl}/refresh_token`)
    }
}
