FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN mkdir /var/log/backend-user

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["docker-entrypoint.sh"] 
CMD ["npm", "run", "dev"]

