import { Component } from "@angular/core"
import { ApiService } from "src/app/api.service"
import { Router } from "@angular/router"
import { FormGroup, FormBuilder, Validators } from "@angular/forms"

import { AuthService, Credentials } from "./auth.service"

@Component({
    template: `
        <div class="flex flex-col items-center justify-center h-full">
            <div class="w-full max-w-xs">
                <form
                    [formGroup]="loginForm"
                    (ngSubmit)="onSubmit()"
                    class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                >
                    <h1 class="block text-gray-700 text-5xl mb-2">Login</h1>
                    <div class="mb-6">
                        <label for="email" class="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input
                            formControlName="email"
                            type="text"
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            [ngClass]="{
                                'border-red-500 focus:shadow-none': submitted && f.email.errors
                            }"
                        />
                        <div
                            *ngIf="submitted && f.email.errors"
                            class="absolute text-red-500 text-xs italic"
                        >
                            <div *ngIf="f.email.errors.required">
                                Email is required
                            </div>
                        </div>
                    </div>
                    <div class="mb-6">
                        <label for="password" class="block text-gray-700 text-sm font-bold mb-2">
                            Password
                        </label>
                        <input
                            formControlName="password"
                            type="password"
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            [ngClass]="{
                                'border-red-500 focus:shadow-none': submitted && f.password.errors
                            }"
                        />
                        <div
                            *ngIf="submitted && f.password.errors"
                            class="absolute text-red-500 text-xs italic"
                        >
                            <div *ngIf="f.password.errors.required">
                                Password is required
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center justify-between pt-3">
                        <button
                            [disabled]="loading"
                            type="submit"
                            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
    loginForm: FormGroup
    loading = false
    submitted = false

    constructor(
        private api: ApiService,
        private router: Router,
        private formBuilder: FormBuilder,
        private auth: AuthService
    ) {}

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: ["billy2@bob.com", [Validators.required]],
            password: ["test123", [Validators.required]]
        })
    }

    get f() {
        return this.loginForm.controls
    }

    onSubmit() {
        this.submitted = true

        if (this.loginForm.invalid) {
            return
        }

        this.loading = true
        this.api.login<Credentials>(this.loginForm.value).subscribe(
            data => {
                console.log("login", data)
                this.auth.setCredentials(data)
                this.router.navigate(["/profile"])
            },
            error => {
                this.loading = false
                setTimeout(() => alert(error.statusText))
            }
        )
    }

    whoami() {
        this.api.whoami().subscribe()
    }
}
