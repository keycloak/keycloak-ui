FROM node:12

RUN rm -fr /usr/local/bin/yarn* &&\
    npm install -g yarn

WORKDIR /app
COPY . .

RUN yarn

CMD [ "yarn", "start" ]
