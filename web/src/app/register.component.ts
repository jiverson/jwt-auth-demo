import { Component, OnInit } from "@angular/core"
import { ApiService } from "./api.service"
import { Router } from "@angular/router"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { first } from "rxjs/operators"

// custom validator to check that two fields match
export function MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName]
        const matchingControl = formGroup.controls[matchingControlName]

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true })
        } else {
            matchingControl.setErrors(null)
        }
    }
}

@Component({
    template: `
        <div class="flex flex-col items-center justify-center h-full">
            <div class="w-full max-w-xs">
                <form
                    [formGroup]="registerForm"
                    (ngSubmit)="onSubmit()"
                    class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                >
                    <h1 class="block text-gray-700 text-5xl mb-2">Register</h1>
                    <div class="mb-6">
                        <label for="username" class="block text-gray-700 text-sm font-bold mb-2">
                            Choose your username
                        </label>
                        <input
                            formControlName="username"
                            type="text"
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            [ngClass]="{
                                'border-red-500 focus:shadow-none': submitted && f.username.errors
                            }"
                        />
                        <div
                            *ngIf="submitted && f.username.errors"
                            class="absolute text-red-500 text-xs italic"
                        >
                            <div *ngIf="f.username.errors.required">
                                Username is required
                            </div>
                        </div>
                    </div>
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
                            <div *ngIf="f.email.errors.email">
                                Email is invalid
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
                            <div *ngIf="f.password.errors.minlength">
                                Password must be at least 6 characters
                            </div>
                        </div>
                    </div>
                    <div class="mb-6">
                        <label
                            for="passwordConfirm"
                            class="block text-gray-700 text-sm font-bold mb-2"
                        >
                            Confirm Password
                        </label>
                        <input
                            formControlName="passwordConfirm"
                            type="password"
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            [ngClass]="{
                                'border-red-500 focus:shadow-none':
                                    submitted && f.passwordConfirm.errors
                            }"
                        />
                        <div
                            *ngIf="submitted && f.passwordConfirm.errors"
                            class="absolute text-red-500 text-xs italic"
                        >
                            <div *ngIf="f.passwordConfirm.errors.required">
                                Password confirmation is required
                            </div>
                            <div *ngIf="f.passwordConfirm.errors.mustMatch">
                                Password mismatch
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center justify-between pt-3">
                        <button
                            [disabled]="loading"
                            type="submit"
                            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
export class RegisterComponent implements OnInit {
    registerForm: FormGroup
    loading = false
    submitted = false

    constructor(
        private api: ApiService,
        private router: Router,
        private formBuilder: FormBuilder
    ) {}

    ngOnInit() {
        this.registerForm = this.formBuilder.group(
            {
                username: ["", Validators.required],
                email: ["", [Validators.required, Validators.email]],
                password: ["", [Validators.required, Validators.minLength(6)]],
                passwordConfirm: ["", [Validators.required]]
            },
            {
                validators: MustMatch("password", "passwordConfirm")
            }
        )
    }

    get f() {
        return this.registerForm.controls
    }

    onSubmit() {
        this.submitted = true

        if (this.registerForm.invalid) {
            return
        }

        this.loading = true
        this.api
            .register<{ id: number }>(this.registerForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    console.log("register", data.id) // DEBUG
                    this.router.navigate(["/login"])
                },
                error => {
                    this.loading = false
                    setTimeout(() => alert(error.statusText))
                }
            )
    }
}
