FROM node:23-alpine

RUN mkdir -p /api/node_modules && chown -R node:node /api

WORKDIR /api

USER node

# Copy package files first for better caching
COPY --chown=node:node package*.json ./
COPY --chown=node:node tsconfig.json ./

# Copy all package structure
COPY --chown=node:node packages/ ./packages/

# Copy source code
COPY --chown=node:node src/ ./src/

# Install dependencies
RUN npm install --force

# Build
RUN npm run build

# Copy docs to the correct location for routes package
RUN mkdir -p packages/routes/dist/docs && cp packages/routes/docs/apispec.yml packages/routes/dist/docs/

ENV NODE_ENV="production"

EXPOSE 3000

CMD [ "node", "dist/index.js" ]