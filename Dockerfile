FROM node:7.5.0-alpine
MAINTAINER Todsaporn Banjerdkit <katopz@gmail.com>

ARG SRC_NEXT_PAGES=${SRC_NEXT_PAGES:-'./pages'}
ARG SRC_NEXT_COMPONENTS=${SRC_NEXT_COMPONENTS:-'./components'}
ARG SRC_NEXT_LIB=${SRC_NEXT_LIB:-'./lib'}
ARG SRC_NEXT_STATIC=${SRC_NEXT_STATIC:-'./public'}
ARG SRC_MONGOOSE_MODELS=${SRC_MONGOOSE_MODELS:-'./models'}
ARG SRC_MONGOOSE_ROUTES=${SRC_MONGOOSE_ROUTES:-'./routes'}
ARG SRC_PASSPORT_PROVIDERS=${SRC_PASSPORT_PROVIDERS:-'./providers'}
ARG SRC_SERVER=${SRC_SERVER:-'./server'}

# Ref : http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/
# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
COPY package.json /tmp/package.json
RUN npm config set registry https://registry.npmjs.org/
RUN cd /tmp && npm install
RUN mkdir -p /usr/app && cp -a /tmp/node_modules /usr/app/
WORKDIR /usr/app

# Passport provider
RUN mkdir -p /usr/app/providers
COPY providers /usr/app/providers

# Server layer
RUN mkdir -p /usr/app/server
COPY server /usr/app/server

# From here we load our application's code in, therefore the previous docker
# "layer" thats been cached will be used if possible
COPY package.json /usr/app/
COPY index.js /usr/app/

# Make volume path
VOLUME ["/usr/app/.env", "/usr/app/pages", "/usr/app/components", "/usr/app/lib", "/usr/app/public", "/usr/app/models", "/usr/app/routes", "/usr/app/providers", "/usr/app/server"]

# Port
# Node Inspector port
EXPOSE 5858
# HTTP port, default to 3000
EXPOSE ${HTTP_PORT:-3000}

# Start server (Can't start yet bacause volume is not ready yet, we'll start with compose instead)
# CMD [ "npm", "start"]