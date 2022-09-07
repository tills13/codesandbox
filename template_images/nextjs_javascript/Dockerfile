FROM node:16

LABEL version="1.0"

RUN curl -fsSL https://code-server.dev/install.sh | sh

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]

EXPOSE 8080 3000

CMD ["npm", "start"]