FROM node:12-alpine as builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM node:12-alpine as dependencies
WORKDIR /app
COPY ./package* ./
RUN npm install --production

FROM node:12-alpine
WORKDIR /app
RUN apk --no-cache update && \
    apk --no-cache add tzdata
RUN rm -rf /var/cache/apk/*
COPY --from=builder /app/dist ./dist
COPY --from=dependencies /app/node_modules ./node_modules
COPY ./package* ./

CMD ["npm", "run", "start:prod"]
