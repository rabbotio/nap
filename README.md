# nap
[WIP] NextJS/ApolloJS/PassportJS
Build in Next JS for SSR, Apollo Client for GraphQL, Passport JS for authentication, Docker for development and production.

![](art/nap-logo.png)

## Overview
```
Docker
├─ Nginx ["/etc/nginx/sites-enabled", "/etc/nginx/certs", "/etc/nginx/conf.d", "/var/log/nginx", "/var/www/html"]
├─ NodeJS 7.5 --harmony, nodemon
│  ├─ NextJS ["/usr/app/pages", "/usr/app/components", "/usr/app/lib", "/usr/app/routes", "/usr/app/server"]
│  ├─ Apollo GraphQL ["/usr/app/models", "/usr/app/hooks"]
│  └─ PassportJS ["/usr/app/providers"]
├─ Redis ["/data"]
└─ MongoDB ["/data/db"]
```

## Stacks
- [x] [`next`](https://github.com/zeit/next.js/) for SSR `React`.
- [x] [`apollo`](https://github.com/apollographql) for `GraphQL` client.
- [x] [`passport`](https://github.com/jaredhanson/passport) for `Express` authentication.

## Extras
- [x] [`express`](https://github.com/expressjs/express) for web framework.
- [x] [`express-session`](https://github.com/expressjs/session) for persist session via `Redis`.
- [x] [`graffiti-mongoose`](https://github.com/RisingStack/graffiti-mongoose) for auto schema `GraphQL` from `MongoDB`.
- [x] Pre/Post [`graffiti-mongoose` hooks](https://github.com/RisingStack/graffiti-mongoose#resolve-hooks) for authentications.
- [ ] [`nginx`](https://github.com/nginxinc) for proxy.
- [ ] [`certbot`](https://github.com/rabbotio/nginx-certbot) for TLS.

- - -

## Configurations
> Copy from `.env.example` template and `.env` as you wish
```shell
cp .env.example .env
```

- [x] Can enable/disable `GraphQL`, `GraphiQL` capabilities.
- [x] Can enable/disable `Passport` capabilities.
- [x] Can custom `MongoDB` connection URI, `db` volume.
- [x] Can custom `Redis` connection URI, `db` volume.
- [x] Can custom `GraphQL` schema via `Mongoose` models.
- [x] Can custom `GraphQL` pre/post hooks via `hooks`.
- [x] Can custom `Passport` providers `Facebook`, `Twitter`, `Google`, `Github`.
- [x] Can custom `Next` static content.
- [x] Can custom `Next` dynamic routes.
- [x] Can custom `Next` pages and components.

## Develop
### To develop backend
```shell
# To build and run docker compose (it take sometime to build)
npm run up

# Try modify file in ./routes ./server and see the result
open http://localhost:3000

# Try modify file in ./models ./hooks and see the result via GraphiQL
open http://localhost:3000/graphql

# To trigger frontend next build inside container
npm run build
```

### To develop frontend
```shell
# Change docker-compose from
    command: npm run _build-back
# to
    command: npm run _build-front

# To build and run docker compose (it take sometime to build)
npm run up

# Try modify file in ./pages ./component ./lib and see the result (will need refresh)
open http://localhost:3000
```

### Addition
```shell
# To kill all and tear down
npm run down

# To dive in container
npm run dive
```

- - -

## Docker volume
```shell
# Next
SRC_NEXT_PAGES=./pages
SRC_NEXT_COMPONENTS=./components
SRC_NEXT_STATIC=./public
SRC_NEXT_LIB=./lib
SRC_MONGOOSE_ROUTES=./routes
SRC_SERVER=./server

# Apollo GraphQL Mongoose
SRC_MONGOOSE_MODELS=./models
SRC_MONGOOSE_HOOKS=./hooks

# Passport
SRC_PASSPORT_PROVIDERS=./providers
```

- - -

## Apollo GraphQL
```shell
# This will auto sync via docker volume and auto build by nodemon
SRC_MONGOOSE_MODELS=./models
SRC_MONGOOSE_HOOKS=./hooks

# Query
{
  pets(name: "katopz") {
    id
    name
  }
}

# Mutation
mutation{
  addPet(input:{name:"katopz", type: "B", age: 11}) {
    viewer {
      pets(name:"katopz") {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  }
}
```
More query : https://github.com/RisingStack/graffiti-mongoose#usage

- - -

## Passport
- [x] Facebook :  http://localhost:3000/auth/facebook/
- [x] Github :  http://localhost:3000/auth/github/
- [ ] Twitter :  http://localhost:3000/auth/twitter/
- [ ] Google :  http://localhost:3000/auth/google/

- - -

## TODO
- [ ] Add [graphql-compose](https://github.com/nodkz/graphql-compose) support
- [ ] Add [Swarm mode stack](https://gist.githubusercontent.com/katopz/e4d5cf402a53c4a002a657c4c4f67a3f/raw/077ac9057c789f49a366563941dd749827d52e3d/setup-swarm-stack.sh)
- [ ] Add `Nginx` TLS container. https://github.com/rabbotio/nginx-certbot
- [ ] Add HTTPS https://github.com/vfarcic/docker-flow-stacks/blob/master/ssl/README.md
- [ ] Add email/pass user.https://github.com/iaincollins/nextjs-starter
- [ ] Link user with social.
- [ ] Grateful shutdown.
- [ ] Don't run as root https://github.com/jdleesmiller/docker-chat-demo/blob/master/Dockerfile

## TOTEST
- [ ] `Redis` fail test.
- [ ] `MongoDB` fail test.
- [ ] HTTP fail test.
- [ ] HTTPS fail test.
- [ ] Unit test `graffiti-mongoose` hooks.
- [ ] `Passport` test.

## TOCUSTOM
- [ ] Custom app, Ensure ES6 with vscode debug working.
- [ ] Custom `MongoDB` replication `docker exec -it node1 mongo --eval "rs.initiate()"`
- [ ] [Run Multiple Docker Environments (qa, stage, prod) from the Same docker-compose File.](http://staxmanade.com/2016/07/run-multiple-docker-environments--qa--beta--prod--from-the-same-docker-compose-file-/)
- [ ] Add `passport` Twitter.
- [ ] Add `passport` Google.
- [ ] HTTPS with https://github.com/expressjs/session#cookiesecure
- [ ] Production vs Development. `docker-compose -f docker-compose.yml -f production.yml up -d`
- [ ] Container config e.g. restart policy, limits CPU/RAM.
```
version: "3"
services:
  web:
    image: web
    labels:
      com.example.description: "This label will appear on all containers for the web service"
    deploy:
      labels:
        com.example.description: "This label will appear on the web service"
      resources:
        limits:
          cpus: '0.001'
          memory: 50M
        reservations:
          cpus: '0.0001'
          memory: 20M
      mode: replicated
      replicas: 6
      update_config:
        parallelism: 2
        delay: 10s
      restart_policy:
        condition: on-failure
      placement:
        constraints:
          - node.role == manager
          - engine.labels.operatingsystem == ubuntu 14.04
```

## TOHAVE
- [ ] Notifications Support : https://pusher.com/docs/push_notifications/reference/architecture
- [ ] More logs. https://github.com/expressjs/morgan
- [ ] Use base-image? https://github.com/phusion/passenger-docker
- [ ] Use yo man gen passport vendors
- [ ] RabbitMQ?
- [ ] Notifications or maybe use vendors with webtask.
- [ ] GraphQL subscriptions :https://github.com/apollographql/graphql-subscriptions
- [ ] GraphQL advance examples.
- [ ] yarn? https://github.com/kriasoft/nodejs-api-starter/blob/master/docker-compose.yml#L18
- [ ] Fallback for `Redis` session store.
- [ ] Add MongoDB replica set/sharding? https://github.com/sisteming/mongodb-swarm
- [ ] GraphQL MongoDB query projection https://github.com/RisingStack/graphql-server
- [ ] Cache MongoDB with Redis https://www.npmjs.com/package/mongoose-redis-cache
- [ ] Add [graphql-sequelize](https://github.com/mickhansen/graphql-sequelize)
- [ ] Admin Dashboard with `SSH`.
- [ ] Authen with mobile via [`Digits`](https://docs.fabric.io/web/digits/overview.html)
- [ ] Cron with `webtask.io`.
- [ ] `graffiti` simple API.
- [ ] [Backing Up and Restoring Data Volumes](http://www.tricksofthetrades.net/2016/03/14/docker-data-volumes/)