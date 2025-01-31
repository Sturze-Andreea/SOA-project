FROM node:18

WORKDIR /notifications-be

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5001

CMD ["node", "index.js"]
