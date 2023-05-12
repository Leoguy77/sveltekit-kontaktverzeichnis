FROM node

ARG APIUser
ARG APIPW

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

CMD [ "node", "build" ]