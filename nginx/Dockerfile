FROM nginx:alpine
COPY ./nginx.conf /etc/nginx/nginx.conf
RUN mkdir -p /data/nginx
RUN mkdir /ssl
COPY ./domain.crt /ssl/
COPY ./domain.rsa /ssl/