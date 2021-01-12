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

# Ensure timezone data is available
RUN apk --no-cache update && \
    apk --no-cache add tzdata
RUN rm -rf /var/cache/apk/*

# Copy build app and dependencies
COPY --from=builder /app/dist ./dist
COPY --from=dependencies /app/node_modules ./node_modules
COPY ./package.json ./

# Setup config path
ENV DATA_DIR="/data"
RUN mkdir -p $DATA_DIR
RUN chown -R node:node $DATA_DIR

USER node
CMD ["npm", "run", "start:prod"]
