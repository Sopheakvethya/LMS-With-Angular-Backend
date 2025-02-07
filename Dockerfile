FROM oven/bun:latest

WORKDIR /app

COPY package*.json ./

RUN bun install

COPY . .

CMD ["sh", "-c", "bun db-seed && bun start"]
