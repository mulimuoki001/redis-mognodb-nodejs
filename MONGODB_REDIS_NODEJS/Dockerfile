FROM node:slim
WORKDIR /app
COPY  package*.json ./
COPY ./ .env ./
RUN npm install
COPY . .
CMD node index.js
EXPOSE 3000