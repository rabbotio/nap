FROM node:7.5.0-alpine
MAINTAINER Todsaporn Banjerdkit <katopz@gmail.com>

ARG SRC_NEXT=${SRC_NEXT:-'./.next'}
ARG SRC_MONGOOSE_MODELS=${SRC_MONGOOSE_MODELS:-'./models'}

# Ref : http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/
# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
COPY package.json /tmp/package.json
RUN npm config set registry https://registry.npmjs.org/
RUN cd /tmp && npm install
RUN mkdir -p /usr/app && cp -a /tmp/node_modules /usr/app/
WORKDIR /usr/app

# From here we load our application's code in, therefore the previous docker
# "layer" thats been cached will be used if possible
COPY server /usr/app/server
COPY .env /usr/app/.env
COPY package.json /usr/app/
COPY index.js /usr/app/

# Make volume path
RUN mkdir -p /usr/app/.next && mkdir -p /usr/app/models
VOLUME ["/usr/app/.next", "/usr/app/models"]

# Port
# Node Inspector port
EXPOSE 5858
# HTTP port, default to 3000
EXPOSE ${HTTP_PORT:-3000}

# node_modules
ENV NODE_PATH /usr/app/node_modules/

# Start server
# CMD [ "npm", "run", "server"]