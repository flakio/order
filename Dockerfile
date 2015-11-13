FROM node:5.0.0

EXPOSE 9000

WORKDIR /app

CMD ["node", "./server.js"]

ENV NODE_ENV production

COPY ./src ./
