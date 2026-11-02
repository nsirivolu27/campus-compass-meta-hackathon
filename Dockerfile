FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4317
COPY --chown=node:node package.json ./
COPY --chown=node:node server ./server
COPY --chown=node:node scripts/serve.mjs ./scripts/serve.mjs
COPY --chown=node:node web ./web
USER node
EXPOSE 4317
CMD ["node", "scripts/serve.mjs"]
