import { Component } from "@angular/core"
import { HttpClient, HttpHeaders } from "@angular/common/http"

@Component({
    selector: "app-root",
    template: `
        <div class="flex flex-col items-center justify-center h-full">
            <div class="w-full max-w-xs">
                <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
                            Email
                        </label>
                        <input
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            name="email"
                            [(ngModel)]="model.email"
                            type="text"
                        />
                    </div>
                    <div class="mb-6">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                            Password
                        </label>
                        <input
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            name="password"
                            [(ngModel)]="model.password"
                            type="password"
                        />
                        <!-- border-red-500 -->
                        <!-- <p class="text-red-500 text-xs italic">Please choose a password.</p> -->
                    </div>
                    <div class="flex items-center justify-between">
                        <button
                            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button"
                            (click)="login()"
                        >
                            Log In
                        </button>
                        <a
                            class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                            href
                            (click)="register()"
                        >
                            Need to Register?
                        </a>
                    </div>
                </form>
                <p class="text-center text-gray-500 text-xs">
                    &copy;2019 Acme Corp. All rights reserved.
                </p>
                <button class="block mb-4" type="button" (click)="register()">Register</button>
                <button class="block mb-4" type="button" (click)="login()">Login</button>
                <button class="block mb-4" type="button" (click)="logout()">Logout</button>
                <button class="block mb-4" type="button" (click)="me()">me</button>
                <button class="block mb-4" type="button" (click)="helloWorld()">Hello world</button>
            </div>
        </div>
    `,
    styles: []
})
export class AppComponent {
    private url = "api"

    model = {
        email: null,
        password: null
    }

    private httpOptions: {
        headers: HttpHeaders
    }

    constructor(private http: HttpClient) {}

    helloWorld() {
        this.http.get(this.url, { responseType: "text" }).subscribe((value) => {
            console.log("helloWorld -->", value) // DEBUG
        })
    }

    register() {
        const { email, password } = this.model
        this.http
            .post(`${this.url}/register`, {
                email,
                password
            })
            .subscribe((value) => {
                console.log("register -->", value) // DEBUG
            }, this.handleError)
    }

    login() {
        const { email, password } = this.model
        this.http
            .post(`${this.url}/login`, {
                email,
                password
            })
            .subscribe((value: any) => {
                console.log("login -->", value) // DEBUG
                this.httpOptions = {
                    headers: new HttpHeaders({
                        Authorization: `Bearer ${value.access_token}`
                    })
                }
            }, this.handleError)
    }

    logout() {
        this.http.post(`${this.url}/logout`, {}).subscribe((value) => {
            console.log("logout -->", value) // DEBUG
        })
    }

    me() {
        this.http.get(`${this.url}/me`, this.httpOptions).subscribe((value) => {
            console.log("me -->", value) // DEBUG
        }, this.handleError)
    }

    private handleError(error: any) {
        setTimeout(() => alert(error.statusText))
    }
}
