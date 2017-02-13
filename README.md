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
│  ├─ Apollo GraphQL ["/usr/app/models"]
│  └─ PassportJS ["/vendors"]
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
- [x] Pre/Post [`graffiti-mongoose` hooks](https://github.com/RisingStack/graffiti-mongoose#resolve-hooks).
- [ ] [`nginx`](https://github.com/nginxinc) for proxy.
- [ ] [`certbot`](https://github.com/rabbotio/nginx-certbot) for TLS.

## Config
```shell
# Edit .env as you wish
cp .env.example .env
```

## Develop
### To develop frontend
```shell
# Install dependency
npm i

# Develop with `nextjs` as usual, Try modify pages, components, lib, public
npm run dev

# Open browser (Ensure to stop other localhost services first)
open http://localhost:3000/
```

### To develop backend
```shell
# Change Redis, MongoDB to your .env
EXPRESS_SESSION_REDIS_URI=redis://localhost
MONGO_URI=mongodb://localhost/graphql

# Manually do what docker compose do or just use docker compose :)
npm run up

# Then stop `nap` server inside container.
npm run stop

# Finally start server from external.
npm run serve
```

### To develop frontend via docker
```shell
# Change docker-compose from
    command: npm run build-back
# to 
    command: npm run build-front

# To build and run docker compose (it take sometime to build)
npm run up

# Try modify file in ./pages ./component ./lib and see the result (will need refresh)
open http://localhost:3000
```

### To develop backend via docker
```shell
# To build and run docker compose (it take sometime to build)
npm run up

# Try modify file in ./routes ./server and see the result
open http://localhost:3000

# Try modify file in ./models and see the result via GraphiQL
open http://localhost:3000/graphql
```

### Addition
```shell
# To kill all and tear down
npm run down

# To dive in container
npm run dive
```

- - -

## Next
```shell
# This will auto sync by docker volume
SRC_NEXT_PAGES=./pages
SRC_NEXT_COMPONENTS=./components
SRC_NEXT_STATIC=./public
SRC_NEXT_LIB=./lib
```

- - -

## Apollo GraphQL
```shell
# This will auto sync via docker volume and auto build by nodemon
SRC_MONGOOSE_MODELS=./models

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

## Mongoose/Graffiti/GraphQL
You may need to config `MongoDB` URI at `.env`
```shell
# For localhost standalone dev
MONGO_URI=mongodb://mongo/graphql
```
- - -

## Passport
You may need to config `Redis` URI at `.env`
```shell
EXPRESS_SESSION_REDIS_URI=redis://redis
```
### To login with Facebook
- http://localhost:3000/auth/facebook/

- - -

## TODO
- [ ] Add [Swarm mode stack](https://gist.githubusercontent.com/katopz/e4d5cf402a53c4a002a657c4c4f67a3f/raw/077ac9057c789f49a366563941dd749827d52e3d/setup-swarm-stack.sh)
- [ ] Add `Nginx` TLS container. https://github.com/rabbotio/nginx-certbot
- [ ] Add HTTPS https://github.com/vfarcic/docker-flow-stacks/blob/master/ssl/README.md
- [ ] Add logs. https://github.com/expressjs/morgan
- [ ] Add email/pass user.https://github.com/iaincollins/nextjs-starter
- [ ] Link user with social.
- [ ] Grateful shutdown.
- [ ] Don't run as root https://github.com/jdleesmiller/docker-chat-demo/blob/master/Dockerfile

## TOTEST
- [ ] Redis fail test.
- [ ] MongoDB fail test.
- [ ] HTTP fail test.
- [ ] HTTPS fail test.
- [ ] Test `graffiti-mongoose` hooks.
- [ ] Passport test.

## TOCUSTOM
- [ ] Custom app, Ensure ES6 with vscode debug working.
- [ ] Custom MongoDB replication `docker exec -it node1 mongo --eval "rs.initiate()"`
- [ ] [Run Multiple Docker Environments (qa, stage, prod) from the Same docker-compose File.](http://staxmanade.com/2016/07/run-multiple-docker-environments--qa--beta--prod--from-the-same-docker-compose-file-/)
- [ ] Add passport github.
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
- [ ] Notifications Support.
- [ ] Admin Dashboard with `SSH`.
- [ ] Authen with mobile via [`Digits`](https://docs.fabric.io/web/digits/overview.html)
- [ ] Cron with `webtask.io`.
- [ ] `graffiti` simple API.
- [ ] [Backing Up and Restoring Data Volumes](http://www.tricksofthetrades.net/2016/03/14/docker-data-volumes/)