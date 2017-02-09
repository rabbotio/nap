FROM node:7.5.0-alpine
MAINTAINER Todsaporn Banjerdkit <katopz@gmail.com>

# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
ADD package.json /tmp/package.json
RUN npm config set registry https://registry.npmjs.org/
RUN cd /tmp && npm install
RUN mkdir -p /usr/app && cp -a /tmp/node_modules /usr/app/

# From here we load our application's code in, therefore the previous docker
# "layer" thats been cached will be used if possible
WORKDIR /usr/app
ADD . /usr/app

# Custom pages/components
ADD $NEXT_PAGES /usr/app/pages/
ADD $NEXT_COMPONENTS /usr/app/components/

# Custom GraphQL schema
ADD $GRAPHQL_SCHEMA /usr/app/graphql/schema/

# Build next
RUN npm run build-next

# Port
EXPOSE 5858
EXPOSE 3000

CMD [ "npm", "start" ]