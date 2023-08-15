FROM node:lts-alpine3.18

ARG MEILI_MASTER_KEY=$MEILI_MASTER_KEY
ARG Prisma_URL=$Prisma_URL
ARG QUERY_BATCH_SIZE=$QUERY_BATCH_SIZE
ARG JWT_Secret=$JWT_Secret
ARG AD_Controller=$AD_Controller
ARG AD_Searchbase=$AD_Searchbase
ARG AD_AccessGroupDN=$AD_AccessGroupDN
ARG MEILI_ENV=$MEILI_ENV
ARG MEILI_NO_ANALYTICS=$MEILI_NO_ANALYTICS

WORKDIR /app

COPY . .

RUN npm install

RUN npx prisma generate

RUN npm run build

CMD [ "node", "build" ]
