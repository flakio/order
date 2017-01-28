FROM node:7.4.0-alpine

WORKDIR /app

CMD ["node", "./server.js"]

ENV NODE_PATH=/app NODE_PORT=80

COPY ./src ./

RUN npm install
