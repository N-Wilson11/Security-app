FROM node:22-alpine

ENV NODE_ENV=production \
    PORT=3005

WORKDIR /app

COPY --chown=node:node package.json ./
COPY --chown=node:node src ./src
COPY --chown=node:node public ./public

USER node

EXPOSE 3005

CMD ["npm", "start"]
