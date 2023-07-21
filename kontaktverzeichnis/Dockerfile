FROM node:lts-alpine3.18

WORKDIR /app

COPY . .

RUN npm install

ARG APIUser
ARG APIPW
ARG SERVER

RUN npm run build

CMD [ "node", "build" ]