FROM node:7.5.0-alpine
MAINTAINER Todsaporn Banjerdkit <katopz@gmail.com>

# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
ADD package.json /tmp/package.json
RUN npm config set registry https://registry.npmjs.org/
RUN cd /tmp && npm install
RUN mkdir -p /usr/app && cp -a /tmp/node_modules /usr/app/
RUN mkdir -p /usr/app

# From here we load our application's code in, therefore the previous docker
# "layer" thats been cached will be used if possible
ADD server /usr/app/server
ADD passport /usr/app/passport
ADD graphql /usr/app/graphql
ADD lib /usr/app/lib
ADD index.js /usr/app/
ADD package.json /usr/app/
ADD .env /usr/app/.env

# Custom pages/components
ADD ${SRC_NEXT_PAGES:-'pages'} /usr/app/pages
ADD ${SRC_NEXT_COMPONENTS:-'components'} /usr/app/components

# Custom GraphQL schema
ADD ${SRC_GRAPHQL_SCHEMA:-'schema'}  /usr/app/graphql/schema

RUN ls /usr/app

# Build next
RUN npm run build-next

# Port
EXPOSE 5858
EXPOSE 3000

WORKDIR /usr/app
CMD [ "npm", "start" ]