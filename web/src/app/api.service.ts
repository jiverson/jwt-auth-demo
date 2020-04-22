import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import { environment } from "../environments/environment"

@Injectable({
    providedIn: "root",
})
export class ApiService {
    private readonly baseUrl: string

    constructor(private http: HttpClient) {
        this.baseUrl = environment.api_url
    }

    helloWorld(): Observable<any> {
        return this.http.get(this.baseUrl, { responseType: "text" })
    }

    me<T>(): Observable<T> {
        return this.http.get<T>(`${this.baseUrl}/me`)
    }

    profile<T>(): Observable<T> {
        return this.http.get<T>(`${this.baseUrl}/profile`)
    }
}
