FROM mozilla/sbt AS sbt
WORKDIR /user/src/api
COPY ./api .
RUN sbt "api/run ./swagger.yaml"

FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm ci
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .
RUN npm run build
COPY --from=sbt /user/src/api/swagger.yaml ./dist/api/swagger.yaml

EXPOSE 3000
CMD [ "npm", "start" ]
