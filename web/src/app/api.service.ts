import { Injectable } from "@angular/core"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { Observable } from "rxjs"
import { tap } from "rxjs/operators"

const baseUrl = "api"

@Injectable({
    providedIn: "root"
})
export class ApiService {
    private httpOptions: {
        headers: HttpHeaders
    }

    constructor(private http: HttpClient) {}

    helloWorld(): Observable<any> {
        return this.http.get(baseUrl, { responseType: "text" })
    }

    register(data: any): Observable<any> {
        return this.http.post(`${baseUrl}/register`, data)
    }

    login(email, password): Observable<any> {
        const params = { email, password }
        return this.http.post(`${baseUrl}/login`, params)
        // return this.http.post(`${baseUrl}/login`, params).pipe(
        //     tap((value: any) => {
        //         this.httpOptions = {
        //             headers: new HttpHeaders({
        //                 Authorization: `Bearer ${value.access_token}`
        //             })
        //         }
        //     })
        // )
    }

    logout(): Observable<any> {
        return this.http.post(`${baseUrl}/logout`, this.httpOptions)
    }

    whoami(): Observable<any> {
        return this.http.get(`${baseUrl}/whoami`, this.httpOptions)
    }

    profile(): Observable<any> {
        return this.http.get(`${baseUrl}/profile`, this.httpOptions)
    }

    private handleError(error: any) {
        setTimeout(() => alert(error.statusText))
    }
}
