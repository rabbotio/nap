FROM node:7.5.0-alpine
MAINTAINER Todsaporn Banjerdkit <katopz@gmail.com>

# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
COPY package.json /tmp/package.json
RUN npm config set registry https://registry.npmjs.org/
RUN cd /tmp && npm install
RUN mkdir -p /usr/app && cp -a /tmp/node_modules /usr/app/
RUN mkdir -p /usr/app

# From here we load our application's code in, therefore the previous docker
# "layer" thats been cached will be used if possible
COPY server /usr/app/server
COPY passport /usr/app/passport
COPY graphql /usr/app/graphql
COPY lib /usr/app/lib
COPY index.js /usr/app/
COPY package.json /usr/app/
COPY .env /usr/app/.env

# Custom pages/components
COPY ${SRC_NEXT_PAGES:-'pages'} /usr/app/pages
COPY ${SRC_NEXT_COMPONENTS:-'components'} /usr/app/components

# Custom GraphQL schema
COPY ${SRC_GRAPHQL_SCHEMA:-'schema'}  /usr/app/graphql/schema

RUN ls /usr/app

# Build next
WORKDIR /usr/app
RUN npm run build-next

# Port
EXPOSE 5858
EXPOSE 3000

CMD [ "npm", "start" ]