import { Component } from "@angular/core"
import { ApiService } from "./api.service"
import { Router } from "@angular/router"

interface RegisterData {
    firstName: string | null
    lastName: string | null
    email: string | null
    password: string | null
}

@Component({
    selector: "app-root",
    template: `
        <div class="flex flex-col items-center justify-center h-full">
            <div class="w-full max-w-xs">
                <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h1 class="block text-gray-700 text-5xl mb-2">Register</h1>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="firstName">
                            First Name
                        </label>
                        <input
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="firstName"
                            name="firstName"
                            [(ngModel)]="data.firstName"
                            type="text"
                        />
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="lastName">
                            Last Name
                        </label>
                        <input
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="lastName"
                            name="lastName"
                            [(ngModel)]="data.lastName"
                            type="text"
                        />
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
                            Email
                        </label>
                        <input
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            name="email"
                            [(ngModel)]="data.email"
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
                            [(ngModel)]="data.password"
                            type="password"
                        />
                    </div>
                    <div class="flex items-center justify-between">
                        <button
                            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button"
                            (click)="register()"
                        >
                            Register
                        </button>
                        <a
                            class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                            routerLink="/login"
                        >
                            Cancel
                        </a>
                    </div>
                </form>
            </div>
        </div>
    `,
    styles: []
})
export class RegisterComponent {
    data: RegisterData

    constructor(private api: ApiService, private router: Router) {}

    register() {
        this.api.register(this.data).subscribe(
            () => {
                this.router.navigate(["/login"])
            },
            error => {
                setTimeout(() => alert(error.statusText))
            }
        )
    }
}
