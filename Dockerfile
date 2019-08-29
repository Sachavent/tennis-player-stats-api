FROM node:10.16.3-alpine

COPY package.json .
COPY package-lock.json .
COPY .npmrc .

RUN npm install

# Bundle app source
COPY . .

# Build typescript
RUN npm run build

EXPOSE 3000
CMD [ "npm", "start" ]

