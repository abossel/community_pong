FROM node:current-alpine

WORKDIR /app

# copy configuration files
COPY pong/tsconfig*.json .
COPY pong/package*.json .

# install dependencies from package-lock.json
RUN npm ci

# copy source files
COPY pong/src/ src/

# make the dist directory
RUN npm run build

EXPOSE 3000

CMD npm run start
