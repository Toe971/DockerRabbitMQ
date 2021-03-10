FROM node:15

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# EXPOSE 8080 not needed, change when we need to use the port
CMD [ "node", "rabbitmqTest.js" ]