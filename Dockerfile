FROM node:latest

COPY . .

RUN yarn

RUN yarn run build

EXPOSE 5000

CMD yarn start
