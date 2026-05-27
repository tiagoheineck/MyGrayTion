FROM node:24-slim

WORKDIR /app


RUN chown -R node:node /app

COPY --chown=node:node package.json ./

USER node

RUN npm install

COPY . /app

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]