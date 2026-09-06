FROM ubuntu:24.04

RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]