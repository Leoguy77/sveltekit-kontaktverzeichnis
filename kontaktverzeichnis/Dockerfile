FROM node

WORKDIR /app

COPY . .

RUN npm install

ARG APIUser
ARG APIPW
ARG SERVER

RUN npm run build

CMD [ "node", "build" ]