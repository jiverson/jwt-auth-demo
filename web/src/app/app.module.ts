import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { Routes, RouterModule } from "@angular/router"

import { AppComponent } from "./app.component"
import { LoginComponent } from "./login.component"
import { RegisterComponent } from "./register.component"
import { UserComponent } from "./user.component"

import { AuthInterceptor } from "./auth.inteceptor"

const appRoutes: Routes = [
    { path: "login", component: LoginComponent },
    { path: "register", component: RegisterComponent },
    { path: "profile", component: UserComponent },
    { path: "", redirectTo: "/login", pathMatch: "full" },
    // { path: '**', component: PageNotFoundComponent }
    {
        path: "**",
        redirectTo: "/login",
        pathMatch: "full"
    }
]

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        UserComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule.forRoot(
            appRoutes
            // { enableTracing: true } // <-- debugging purposes only
        )
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
