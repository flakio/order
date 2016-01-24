FROM node:5.5.0-slim

EXPOSE 9000

WORKDIR /app

CMD ["node", "./server.js"]

ENV NODE_ENV=production NODE_PATH=/app NODE_PORT=9000

COPY ./src ./

RUN npm install --production
