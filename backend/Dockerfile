# Tahap 1: Build
FROM node:20 AS build

WORKDIR /backend

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Tahap 2: Development
FROM node:20 AS development

WORKDIR /backend

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -g nodemon

CMD ["npm", "run", "dev"]

# Tahap 3: Production
FROM node:20 AS production

WORKDIR /backend

COPY package*.json ./

RUN npm install --production

COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/index.js"]
