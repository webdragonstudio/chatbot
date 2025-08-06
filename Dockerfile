FROM node:18

# Instala dependências necessárias para Chromium (Puppeteer)
RUN apt-get update && apt-get install -y         libgconf-2-4         libatk1.0-0         libatk-bridge2.0-0         libgtk-3-0         libnss3         libxss1         libasound2         libgbm-dev         libxshmfence1         libxrandr2         libxi6         libxcursor1         libxdamage1         libxtst6         libappindicator3-1         libdrm2         libdbus-1-3         libxcomposite1         libxfixes3         libpango-1.0-0         libcairo2         libglib2.0-0         && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

CMD ["npm", "start"]
