import { Component } from "@angular/core"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { ApiService } from "src/app/api.service"

@Component({
    selector: "app-root",
    template: `
        <router-outlet></router-outlet>
    `,
    styles: []
})
export class AppComponent {
    constructor(private api: ApiService) {}

    logout() {
        this.api.logout().subscribe()
    }
}
