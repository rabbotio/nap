FROM node:8-alpine
MAINTAINER Todsaporn Banjerdkit <katopz@gmail.com>

# Ref : http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/
# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
COPY package.json /tmp/package.json
RUN npm config set registry https://registry.npmjs.org/
RUN cd /tmp && npm install
# Smaller node_modules size
RUN npm i -g modclean && modclean -r -D /tmp/node_modules && npm r -g modclean && du -ms .
RUN mkdir -p /usr/app && cp -a /tmp/node_modules /usr/app/
WORKDIR /usr/app

# Passport provider
RUN mkdir -p /usr/app/providers
COPY providers /usr/app/providers

# Templates layer
RUN mkdir -p /usr/app/templates
COPY templates /usr/app/templates

# Server layer
RUN mkdir -p /usr/app/server
COPY server /usr/app/server

# From here we load our application's code in, therefore the previous docker
# "layer" thats been cached will be used if possible
COPY package.json /usr/app/
COPY index.js /usr/app/

# This will use `nodemon` to watch `/graphql` folder and else while dev
# Will need to use `node` instead in prod
COPY nodemon.json /usr/app/

# Make volume path
VOLUME ["/usr/app/.env", "/usr/app/pages", "/usr/app/components", "/usr/app/lib", "/usr/app/public", "/usr/app/graphql", "/usr/app/routes", "/usr/app/providers", "/usr/app/templates", "/usr/app/server"]

# Port
# Node Inspector port
EXPOSE 5858
# Node V8 Inspector port
EXPOSE 9222
# HTTP port, default to 3000
EXPOSE ${PORT:-3000}

# Start server (Can't start yet bacause volume is not ready yet, we'll start with compose instead)
# CMD [ "npm", "start"]