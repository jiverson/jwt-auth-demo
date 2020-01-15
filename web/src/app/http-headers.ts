import { HttpHeaders, HttpRequest } from "@angular/common/http"

export const SKIP_TOKEN = "X-Skip-TokenInterceptor"
export const skipTokenHeader = new HttpHeaders().set(SKIP_TOKEN, "")

export const authorizationHeader = (request: HttpRequest<any>, token: string) =>
    request.clone({
        headers: request.headers.set("Authorization", `Bearer ${token}`)
    })
