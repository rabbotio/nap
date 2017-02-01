FROM node:7.4.0-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app
RUN npm run build

# For development
RUN npm install -g nodemon
EXPOSE 5858
EXPOSE 3000

# Production
EXPOSE 80

CMD [ "npm", "start" ]