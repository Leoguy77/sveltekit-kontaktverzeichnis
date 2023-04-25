FROM alpine:latest

WORKDIR /pb

COPY . .
RUN mv ./defaultData/data.db ./pb_data/data.db
RUN rmdir ./defaultData

RUN chmod 777 pocketbase

VOLUME [ "/pb_data" ]

EXPOSE 8090

CMD [ "./pocketbase", "serve","--http=0.0.0.0:8090" ]