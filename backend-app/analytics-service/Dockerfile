FROM node:18

WORKDIR /analytics-be

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5002 5003

CMD ["node", "index.js"]
