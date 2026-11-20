FROM node:22-alpine

WORKDIR /app

ARG ENVIRONMENT
ENV ENVIRONMENT=${ENVIRONMENT:-PRODUCTION}

RUN apk add --no-cache bash
RUN npm install --global serve@14.2.4

COPY package.json ./
COPY package-lock.json ./

RUN npm ci

COPY . ./

RUN ./scripts/build.sh

# start app
CMD ["sh", "-c", "./variables.sh dist && serve -s -l tcp://0.0.0.0:3000 dist/"]
