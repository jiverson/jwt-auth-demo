import { Component, OnInit } from "@angular/core"
import { ApiService } from "./api.service"

@Component({
    selector: "app-root",
    template: `
        <div class="flex flex-col items-center justify-center h-full">
            <div class="w-full max-w-xs">
                <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h1 class="block text-gray-700 text-5xl mb-2">Login</h1>
                    <div class="mb-4">Email: {{ email }}</div>
                    <div class="mb-6">Id: {{ id }}</div>
                    <div class="flex items-center justify-between">
                        <a
                            class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                            (click)="logout()"
                        >
                            Logout
                        </a>
                    </div>
                </form>
            </div>
        </div>
    `,
    styles: []
})
export class UserComponent implements OnInit {
    email: string | null
    id: number | null

    constructor(private api: ApiService) {}

    ngOnInit() {
        this.api.profile().subscribe(
            data => {
                console.log("1 --> data", data) // DEBUG
                this.email = data.email
                this.id = data.id
            },
            error => {
                setTimeout(() => alert(error.statusText))
            }
        )
    }

    logout() {
        console.log("1 --> logout") // DEBUG
    }

    helloWorld() {
        this.api.helloWorld().subscribe()
    }
}
