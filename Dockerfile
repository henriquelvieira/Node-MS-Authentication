FROM node:16-slim as BUILDER 
LABEL maintainer="Henrique Lopes Vieira"

WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy all files
COPY . .

FROM node:16-alpine

ARG NODE_ENV

WORKDIR /usr/src/app

COPY --from=BUILDER /usr/src/app/ ./

RUN npm run build

# EXPOSE 3001

CMD [ "npm", "start" ]