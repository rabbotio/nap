[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# nap
[WIP] NextJS/ApolloJS/PassportJS
Build in Next JS for SSR, Apollo Client for GraphQL, Passport JS for authentication, Docker for development and production.

![](https://raw.githubusercontent.com/rabbotio/nap/master/art/nap-logo.png)

## Overview
```
○ Docker
├─ ○ Docker Compose 3.1
│  ├─ Docker Swarm Stack
│  └─ Docker Flow Proxy
│
├─ ○ Nginx
│  ├─ ./nginx/certs   : /etc/nginx/certs
│  ├─ ./nginx/conf.d  : /etc/nginx/conf.d
│  ├─ ./nginx/log     : /var/log/nginx
│  └─ ./nginx/www     : /var/www
│
├─ ○ NodeJS 7.6, nodemon
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
- [x] [next](https://github.com/zeit/next.js/) for SSR `React`.
- [x] [apollo](https://github.com/apollographql) for `GraphQL` client.
- [x] [passport](https://github.com/jaredhanson/passport) for `Express` authentication.

## Extras
- [x] [express](https://github.com/expressjs/express) for web framework.
- [x] [express-session](https://github.com/expressjs/session) for persist session via `Redis`.
- [x] [graphql-compose](https://github.com/nodkz/graphql-compose) for build `GraphQL` types from `Mongoose` with resolvers.
- [x] [mongoose-role](https://github.com/ksmithut/mongoose-role) for manage user roles and user access levels
- [x] [nextjs-starter](https://github.com/iaincollins/nextjs-starter) for basic authentication.
- [x] [modclean](https://www.npmjs.com/package/modclean) for smaller `node_modules`.
- [x] [mailgun](http://www.mailgun.com/) for send email.
- [x] [passport-facebook-token](https://github.com/drudge/passport-facebook-token) for authenticating with Facebook access tokens.
- [x] [lusca](https://github.com/krakenjs/lusca) for web application security middleware.
- [x] [platform](https://github.com/bestiejs/platform.js) for detect client platform.
- [x] [commitizen](https://github.com/commitizen/cz-cli) for commit formatting
- [ ] [nginx](https://github.com/nginxinc) for proxy.
- [ ] [certbot](https://github.com/rabbotio/nginx-certbot) for `TLS`.

- - -

## Configurations
> Copy from `.env.example` template and `.env` as you wish
```shell
cp .env.example .env
```

## Develop
```shell
# To build and run docker compose (it take sometime for first build)
npm run up

# Try modify files and see the HMR result
open http://localhost:3000

# Try modify file in ./graphql and see the result via GraphiQL
open http://localhost:3000/graphql
```

## Debug
- Server side : Use `VSCode` and press F5 to `attach` with nodejs
- Client side : Use `Chrome Dev Tool`

## Addition
```shell
# To kill all and tear down
npm run down

# To dive in container
npm run in
```

## Test
```
# Will need to run server for integration test (WIP)
npm run up

# To test all with Jest
npm run test

# To see coverage
npm run cover
```

- - -

## GraphQL examples
```shell
# For original graphql-compose examples
cp -r ./examples/schema-graphql-compose/ ./graphql/
open http://localhost:3000/graphql/user

# For Apollo style with graphql-tools
cp -r ./examples/schema-graphql-tools/ ./graphql/
open http://localhost:3000/graphql/apollo

# For original style
cp -r ./examples/schema-original/ ./graphql/
open http://localhost:3000/graphql/original
```
- - -

## Passport (cookie)
> Will need test after refactoring

- [x] Facebook : http://localhost:3000/auth/facebook/
- [x] Github : http://localhost:3000/auth/github/
- [x] Twitter : http://localhost:3000/auth/twitter/
- [x] Google : http://localhost:3000/auth/google/
- [x] Email : http://localhost:3000/auth/signin/
- [x] Sign Out : http://localhost:3000/auth/signout/

## Passport (token via GraphQL)
- [x] Facebook
  > Use with `Ract Native` after get `access_token` form `Facebook`, See [nap-react-native](https://github.com/rabbotio/nap-react-native)
  ```shell
  # Login with Facebook access_token and device's info
  mutation loginWithFacebook($deviceInfo: String!, $accessToken: String!) {
    loginWithFacebook(deviceInfo: $deviceInfo, accessToken: $accessToken) {
      sessionToken
      user {
        _id
        name
      }
    }
    errors {
      code
      message
    }
  }

  # To get user profile
  {
    user {
      name
    }
    errors {
      code
      message
    }
  }

  # Logout with current bearer session token
  mutation {
    logout {
      isLoggedIn
    }
  }
  ```
- - -

## Client example
- [x] Login/Logout with `Facebook` from [React Native](https://github.com/rabbotio/nap-react-native).
- [x] Login/Logout with `Facebook` from [NextJS](#passport---cookie).

## DOING
- [ ] Unlink `Facebook` via `React` web.
- [ ] Handle cookies via [React Native](https://mockingbot.com/posts/287)
- [x] Test, Debug with [Jest](http://www.markuseliasson.se/article/debugging-jest-code/)

## TODO
- [ ] Add [Swarm mode stack](https://gist.githubusercontent.com/katopz/e4d5cf402a53c4a002a657c4c4f67a3f/raw/077ac9057c789f49a366563941dd749827d52e3d/setup-swarm-stack.sh)
- [ ] Add `Nginx` TLS container : https://github.com/rabbotio/nginx-certbot
- [ ] Add HTTPS : https://github.com/vfarcic/docker-flow-stacks/blob/master/ssl/README.md
- [ ] Grateful shutdown : https://github.com/heroku-examples/node-articles-nlp/blob/master/lib/server.js#L31
- [ ] Don't run as root : https://github.com/jdleesmiller/docker-chat-demo/blob/master/Dockerfile
- [ ] Separated Dockerfile : https://docs.docker.com/compose/compose-file/#build
- [ ] More secure with [lusca](https://github.com/krakenjs/lusca)
- [ ] [Securing a Containerized Instance of MongoD](http://rancher.com/securing-containerized-instance-mongodb/)

## TOTEST
- [ ] `Redis` fail test.
- [ ] `MongoDB` fail test.
- [ ] HTTP fail test.
- [ ] HTTPS fail test.
- [ ] Unit test `graphql-compose`.
- [ ] Basic signin test.
- [ ] `Passport` test.
- [ ] Sessions expire test.
- [ ] Chaos testing with [pumba](https://github.com/gaia-adm/pumba)

## TOCUSTOM
- [ ] Custom `MongoDB` replication `docker exec -it node1 mongo --eval "rs.initiate()"`
- [ ] [Run Multiple Docker Environments (qa, stage, prod) from the Same docker-compose File.](http://staxmanade.com/2016/07/run-multiple-docker-environments--qa--beta--prod--from-the-same-docker-compose-file-/)
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
- [ ] Docker driver [`lvm-direct`](https://hackernoon.com/how-to-properly-run-docker-on-rhel-and-friends-d055754414e5#.1z2ps9ycr)
- [ ] Notifications Support : https://pusher.com/docs/push_notifications/reference/architecture
- [ ] More logs. https://github.com/expressjs/morgan
- [ ] Use base-image? https://github.com/phusion/passenger-docker
- [ ] RabbitMQ?
- [ ] Notifications or maybe use vendors with webtask.
- [ ] GraphQL subscriptions :https://github.com/apollographql/graphql-subscriptions
- [ ] GraphQL advance examples.
- [ ] yarn? https://github.com/kriasoft/nodejs-api-starter/blob/master/docker-compose.yml#L18
- [ ] Fallback for `Redis` session store.
- [ ] Add MongoDB replica set/sharding? https://github.com/sisteming/mongodb-swarm
- [ ] Cache MongoDB with Redis https://www.npmjs.com/package/mongoose-redis-cache
- [ ] Cache MongoDB with [mongoose-cache](https://github.com/heroku-examples/node-articles-nlp/blob/master/lib/app/article-model.js#L2)
- [ ] Add [graphql-sequelize](https://github.com/mickhansen/graphql-sequelize)
- [ ] Admin Dashboard with `SSH`.
- [ ] Authen with mobile via [Digits](https://docs.fabric.io/web/digits/overview.html)
- [ ] Cron with `webtask.io`.
- [ ] [Backing Up and Restoring Data Volumes](http://www.tricksofthetrades.net/2016/03/14/docker-data-volumes/)
- [ ] [how-to-copy-docker-images-from-one-host-to-another-without-via-repository](http://stackoverflow.com/questions/23935141/how-to-copy-docker-images-from-one-host-to-another-without-via-repository)
- [ ] [Back up and restore dockerized MongoDB](http://blog.btskyrise.com/posts/back-up-and-restore-dockerized-mongodb)
- [ ] [Export Docker Mongo Data](https://github.com/wekan/wekan/wiki/Export-Docker-Mongo-Data)