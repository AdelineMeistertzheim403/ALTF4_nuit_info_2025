FROM node:20-alpine3.18
WORKDIR /app

RUN apk add --no-cache openssl1.1-compat

COPY package*.json ./
COPY prisma ./prisma

RUN npm install
RUN npx prisma generate

COPY . .

EXPOSE 4000
CMD ["sh", "-c", "npx prisma migrate deploy && node src/index.js"]
