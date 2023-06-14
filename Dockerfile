FROM node:alpine

WORKDIR /app
COPY . /app
RUN npm install
RUN npm run build
EXPOSE 1450

ENTRYPOINT ["npm", "run", "preview"]
