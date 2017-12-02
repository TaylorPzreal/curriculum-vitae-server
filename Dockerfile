FROM daocloud.io/node:8
MAINTAINER TaylorPzreal

ENV HTTP_PORT=8000

COPY . /ap
WORKDIR /app


RUN npm install

EXPOSE 8000

CMD [ "npm", "server" ]
