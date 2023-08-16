FROM nginx:alpine
COPY ./nginx.conf /etc/nginx/nginx.conf
RUN mkdir -p /data/nginx
RUN mkdir /ssl
COPY ./domain.key /ssl/
COPY ./domain.chained.crt /ssl/