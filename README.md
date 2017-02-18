# nap
[WIP] NextJS/ApolloJS/PassportJS
Build in Next JS for SSR, Apollo Client for GraphQL, Passport JS for authentication, Docker for development and production.

![](art/nap-logo.png)

## Overview
```
○ Docker
│
├─ ○ Nginx
│  ├─ ./nginx/certs   : /etc/nginx/certs
│  ├─ ./nginx/conf.d  : /etc/nginx/conf.d
│  ├─ ./nginx/log     : /var/log/nginx
│  └─ ./nginx/www     : /var/www
│
├─ ○ NodeJS 7.5 --harmony, nodemon
│  ├─ ○ NextJS 2
│  │  ├─ ./pages      : /usr/app/pages
│  │  ├─ ./components : /usr/app/components
│  │  ├─ ./lib        : /usr/app/lib
│  │  ├─ ./routes     : /usr/app/routes
│  │  └─ ./server     : /usr/app/server
│  │
│  ├─ ○ Apollo GraphQL
│  │  └─ ./graphql    : /usr/app/graphql
│  │
│  └─ ○ PassportJS, Redis
│     └─ ./providers  : /usr/app/providers
│
├─ ○ Redis : redis://redis
│  └─ data            : /data
│
└─ ○ MongoDB : mongodb://mongo/graphql
   └─ data            : /data/db
```

## Stacks
- [x] [`next`](https://github.com/zeit/next.js/) for SSR `React`.
- [x] [`apollo`](https://github.com/apollographql) for `GraphQL` client.
- [x] [`passport`](https://github.com/jaredhanson/passport) for `Express` authentication.

## Extras
- [x] [`express`](https://github.com/expressjs/express) for web framework.
- [x] [`express-session`](https://github.com/expressjs/session) for persist session via `Redis`.
- [x] [`graphql-compose`](https://github.com/nodkz/graphql-compose) for auto schema `GraphQL` from `MongoDB`.
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

# Try modify file in ./graphql and see the result via GraphiQL
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
./pages
./components
./public
./lib
./routes
./server

# GraphQL schema
./graphql

# Passport
./providers
```

- - -

## GraphQL
> https://github.com/nodkz/graphql-compose-examples

```shell
# Copy graphql compose examples to ./graphql volume
cp -r ./examples/schema-graphql-compose/ ./graphql/

# Explore
open http://localhost:3000/graphql/user

# Mutation
mutation {
  userCreate(record: {name: "katopz", age: 18}) {
    record {
      name
      age
    }
  }
}

# Query
{
  userOne {
    name
  }
}
```
![screen shot 2017-02-17 at 23 30 27](https://cloud.githubusercontent.com/assets/97060/23073805/3e333828-f569-11e6-96a7-15789523d43f.png)

### Other examples
```shell
# For Apollo style with graphql-tools
cp -r ./examples/schema-graphql-tools/ ./graphql/
open http://localhost:3000/graphql/apollo

# For original style
cp -r ./examples/schema-original/ ./graphql/
open http://localhost:3000/graphql/original
```
- - -

## Passport
- [x] Facebook :  http://localhost:3000/auth/facebook/
- [x] Github :  http://localhost:3000/auth/github/
- [ ] Twitter :  http://localhost:3000/auth/twitter/
- [ ] Google :  http://localhost:3000/auth/google/

- - -

## TODO
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
- [ ] Unit test `graphql-compose`.
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
- [ ] [how-to-copy-docker-images-from-one-host-to-another-without-via-repository](http://stackoverflow.com/questions/23935141/how-to-copy-docker-images-from-one-host-to-another-without-via-repository)
- [ ] [Back up and restore dockerized MongoDB](http://blog.btskyrise.com/posts/back-up-and-restore-dockerized-mongodb)
- [ ] [Export Docker Mongo Data](https://github.com/wekan/wekan/wiki/Export-Docker-Mongo-Data)
- [ ] Smaller `node_modules` : https://www.npmjs.com/package/modclean