FROM node:7.4.0-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app
RUN ls /usr/src/app
RUN npm run build

EXPOSE 3000
CMD [ "npm", "start" ]