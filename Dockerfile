FROM node:7.5.0-alpine
MAINTAINER Todsaporn Banjerdkit <katopz@gmail.com>

ARG SRC_NEXT_PAGES=${SRC_NEXT_PAGES:-'pages'}
ARG SRC_NEXT_COMPONENTS=${SRC_NEXT_COMPONENTS:-'components'}
ARG SRC_MONGOOSE_MODELS=${SRC_MONGOOSE_MODELS:-'models'}

# Ref : http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/
# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
COPY package.json /tmp/package.json
RUN npm config set registry https://registry.npmjs.org/
RUN cd /tmp && npm install
RUN mkdir -p /usr/app && cp -a /tmp/node_modules /usr/app/
RUN mkdir -p /usr/app

# From here we load our application's code in, therefore the previous docker
# "layer" thats been cached will be used if possible
COPY .env /usr/app/.env
COPY server /usr/app/server
COPY package.json /usr/app/
COPY index.js /usr/app/

# TO BE REMOVE
COPY lib /usr/app/lib

# Custom pages/components
COPY $SRC_NEXT_PAGES /usr/app/pages
COPY $SRC_NEXT_COMPONENTS /usr/app/components

# Custom GraphQL schema from models
VOLUME ["/usr/app/models"]

RUN ls /usr/app

# Build next
WORKDIR /usr/app
RUN npm run build

# Port
EXPOSE 5858
EXPOSE 3000

CMD [ "npm", "start"]