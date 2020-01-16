## Application demonstrating auth service with in-memory tokens

### Running the service

Start the database:

```
$ cd server
$ docker-compose up -d
```
 
Run backend api.

```
$ cd server
$ npm run start
```

Run frontend.

```
$ cd web
$ npm run start
```

Open up http://localhost:9000

### User api calls

```sh
$ # Hello world
$ http GET http://127.0.0.1:9090/

$ # revoke token
$ http -v POST http://127.0.0.1:9090/revoke_token/ userId=1

$ # register
$ http -v POST http://127.0.0.1:9090/register/ email=foo2@bar.com password=123456ww

$ # login
$ http -v POST http://127.0.0.1:9090/login/ email=foo2@bar.com password=123456ww

$ http -v GET http://127.0.0.1:9090/me
```

### Links
* https://scotch.io/tutorials/node-api-schema-validation-with-joi
* https://github.com/vitaly-t/pg-promise
* https://github.com/arb/celebrate
* https://www.loggly.com/blog/http-status-code-diagram/
* https://scotch.io/tutorials/the-anatomy-of-a-json-web-token
* https://blog.angularindepth.com/top-10-ways-to-use-interceptors-in-angular-db450f8a62d6
* https://github.com/melcor76/interceptors
* https://stackblitz.com/github/melcor76/interceptors?file=src%2Fapp%2Fcomponents%2Fauth.component.ts
* https://angular-academy.com/angular-jwt/
* https://github.com/newsiberian/apollo-link-token-refresh
* https://blog.angular-university.io/angular-jwt-authentication/
* https://github.com/http-party/node-http-proxy
* https://github.com/angular/angular/issues/20203
* https://github.com/angular/angular/issues/18155
* [Refresh tokens](https://gist.github.com/ziluvatar/a3feb505c4c0ec37059054537b38fc48)
* [Tailwind](https://dev.to/seankerwin/angular-8-tailwind-css-guide-3m45)
* [Stylelint](https://github.com/bradlc/vscode-tailwindcss/issues/78)


#### Notes
- start:dev will not work when running through the front end because of proxy settings

#### TODO
* add in joi celebrate
* add in proper claims for jwt token information?
* use sqllite

