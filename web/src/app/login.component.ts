import { Component } from "@angular/core"
import { ApiService } from "src/app/api.service"
import { Router } from "@angular/router"

@Component({
    selector: "app-root",
    template: `
        <div class="flex flex-col items-center justify-center h-full">
            <div class="w-full max-w-xs">
                <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h1 class="block text-gray-700 text-5xl mb-2">Login</h1>
                    <div class="mb-4">
                        <label
                            class="block text-gray-700 text-sm font-bold mb-2"
                            for="email"
                        >
                            Email
                        </label>
                        <input
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            name="email"
                            [(ngModel)]="email"
                            type="text"
                        />
                    </div>
                    <div class="mb-6">
                        <label
                            class="block text-gray-700 text-sm font-bold mb-2"
                            for="password"
                        >
                            Password
                        </label>
                        <input
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            name="password"
                            [(ngModel)]="password"
                            type="password"
                        />
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
                            routerLink="/register"
                        >
                            Need to Register?
                        </a>
                    </div>
                </form>
            </div>
        </div>
    `,
    styles: []
})
export class LoginComponent {
    email: string | null = null
    password: string | null = null

    constructor(private api: ApiService, private router: Router) {}

    helloWorld() {
        this.api.helloWorld().subscribe()
    }

    login() {
        this.api.login(this.email, this.password).subscribe(
            data => {
                console.log(data.access_token)
                console.log(data.user.id)
                console.log(data.user.email)
                this.router.navigate(["/profile"])
            },
            error => {
                setTimeout(() => alert(error.statusText))
            }
        )
    }

    whoami() {
        this.api.whoami().subscribe()
    }
}
