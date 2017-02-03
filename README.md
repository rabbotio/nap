# nap
[WIP] NextJS/Apollo/PassportJS

![](art/nap-logo.png)

```
Docker
├─ Nginx ["/etc/nginx/sites-enabled", "/etc/nginx/certs", "/etc/nginx/conf.d", "/var/log/nginx", "/var/www/html"]
├─ NodeJS 7.5
│  ├─ PassportJS ["/vendors"]
│  ├─ Apollo GraphQL ["/graphql"]
│  └─ NextJS ["/app"]
├─ Redis ["/data"]
└─ MongoDB ["/data/db"]
```

## Config
```shell
cp .env.example .env
```
Then fill up `.env` file. e.g.
```
FACEBOOK_APP_ID=213587919136550
FACEBOOK_APP_SECRET=249ac8dcc38afe95decf442fc4e63ec8
```

## Develop
```shell
# To build docker compose
docker-compose build

# To run via docker compose
docker-compose up -d

# Open browser (Stop other localhost services first)
open http://localhost:3000/
```

# GraphQL
![](art/graphql.png)
```
# Query
{
  getFoo(bar:"World")
}

# Mutation
mutation {
  setFoo(bar:"katopz")
}
```

## TODO
- [ ] Add [Swarm mode stack](https://gist.githubusercontent.com/katopz/e4d5cf402a53c4a002a657c4c4f67a3f/raw/077ac9057c789f49a366563941dd749827d52e3d/setup-swarm-stack.sh)
- [ ] yarn https://github.com/kriasoft/nodejs-api-starter/blob/master/docker-compose.yml#L18
- [ ] Redis https://github.com/kriasoft/nodejs-api-starter/blob/master/docker-compose.yml#L34
- [ ] SSL https://github.com/vfarcic/docker-flow-stacks/blob/master/ssl/README.md
- [ ] Add Nginx support.
- [ ] Add test.

## TOCUSTOM
- [ ] Custom app, Ensure ES6 with vscode debug working.
- [ ] Custom schema, Ensure graphql-tools
- [ ] Custom DB, orm, MongoDB `docker exec -it node1 mongo --eval "rs.initiate()"`
- [ ] env_file: .env https://github.com/kriasoft/nodejs-api-starter/blob/master/docker-compose.yml#L10
- [ ] Custom .env HTTP_PORT
- [ ] Add passport github.

## TOHAVE
- [ ] Volume `./app` as container?
- [ ] Volume `./graphql` as container?
- [ ] Use base-image? https://github.com/phusion/passenger-docker
- [ ] Use yo man gen passport vendors
- [ ] RabbitMQ.
- [ ] Debug with VSCode https://alexanderzeitler.com/articles/debugging-a-nodejs-es6-application-in-a-docker-container-using-visual-studio-code/
- [ ] Faster build time https://github.com/npm/npm/issues/8836
- [ ] Notifications or maybe use vendors with webtask.
- [ ] GraphQL subscriptions.
- [ ] GraphQL advance examples.