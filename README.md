## Application demonstrating auth service with in-memory tokens

### Running the service

Start the database:

```sh
cd server
docker-compose up -d
```
 
Run backend api.

```sh
cd server
npm run start
```

Run frontend.

```sh
cd web
npm run start
```

Open up http://localhost:9000

### User api calls

```
GET /
GET /me
GET /profile
POST /revoke_token
POST /register
POST /login
POST /logout
POST /refresh_token
```

* Add `http --verify=no` for secure posts

### Links
* https://blog.angularindepth.com/top-10-ways-to-use-interceptors-in-angular-db450f8a62d6
* https://github.com/http-party/node-http-proxy

#### Notes
- start:dev will not work when running through the front end because of proxy settings

#### TODO
* add in proper claims for jwt token information?
* use sqllite
