## Application demostrating auth service with in memory tokens

### Running the service

Start the database:

```
$ docker-compose up -d
```
 
Run service.

```
$ npm run start
```

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

http -v GET http://127.0.0.1:9090/me
```

### Links
Highly inspired from [here](https://github.com/theaaf/todos) but did not want to rely on an ORM.
* https://scotch.io/tutorials/node-api-schema-validation-with-joi
* https://github.com/vitaly-t/pg-promise
* https://github.com/arb/celebrate
* https://www.loggly.com/blog/http-status-code-diagram/

#### Notes


