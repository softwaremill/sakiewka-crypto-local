FROM node:10-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN apk add --no-cache make gcc g++ python git
RUN npm ci --only=production

# Bundle app source
COPY . .
RUN npm run build

EXPOSE 3000
CMD [ "npm", "start" ]
