# nap
[WIP] NextJS/ApolloJS/PassportJS
Build in Next JS for SSR, Apollo Client for GraphQL, Passport JS for authentication, Docker for development and production.

![](art/nap-logo.png)

## Overview
```
Docker
├─ Nginx ["/etc/nginx/sites-enabled", "/etc/nginx/certs", "/etc/nginx/conf.d", "/var/log/nginx", "/var/www/html"]
├─ NodeJS 7.5
│  ├─ NextJS ["/usr/app/pages", "/usr/app/components", "/usr/app/lib"]
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
- [x] [`nginx`](https://github.com/nginxinc) for proxy.

## Config
```shell
cp .env.example .env
```
Then fill up `.env` file. e.g.
```shell
# This is fake id, use your own!
FACEBOOK_APP_ID=213587919136550
FACEBOOK_APP_SECRET=249ac8dcc38afe95decf442fc4e63ec8
```

## Develop
```shell
# Install dependency
npm i

# To build and run docker compose
npm run up

# Open browser (Ensure to stop other localhost services first)
open http://localhost:3000/
```

## Build
```shell
# To build Docker file
npm run build-image
```

## Examples
- https://github.com/rabbotio/nap-graffiti-mongoose

- - -

## TODO
- [ ] Add pre, post hook for authen https://github.com/RisingStack/graffiti-mongoose#resolve-hooks
- [ ] Add [Swarm mode stack](https://gist.githubusercontent.com/katopz/e4d5cf402a53c4a002a657c4c4f67a3f/raw/077ac9057c789f49a366563941dd749827d52e3d/setup-swarm-stack.sh)
- [ ] Custom routes.
- [ ] Add `Nginx` container.
- [ ] Add HTTPS https://github.com/vfarcic/docker-flow-stacks/blob/master/ssl/README.md
- [ ] Add logs.
- [ ] Add email/pass user.
- [ ] Link user with social.
- [ ] Grateful shutdown.

## TOTEST
- [ ] Redis fail test.
- [ ] HTTP fail test.
- [ ] HTTPS fail test.

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
- [ ] Hook Support.
- [ ] Admin Dashboard with `SSH`.
- [ ] Authen with mobile via [`Digits`](https://docs.fabric.io/web/digits/overview.html)
- [ ] Cron with `webtask.io`.
- [ ] `graffiti` simple API.
- [ ] [Backing Up and Restoring Data Volumes](http://www.tricksofthetrades.net/2016/03/14/docker-data-volumes/)