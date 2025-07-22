FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN mkdir /var/log/backend-blockchain

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]
