FROM node:23-alpine

RUN mkdir -p /api/node_modules && chown -R node:node /api

WORKDIR /api

USER node

# Copy package files first for better caching
COPY --chown=node:node package*.json ./
COPY --chown=node:node tsconfig*.json ./
COPY --chown=node:node register-paths.js ./

# Copy source code
COPY --chown=node:node src/ ./src/

# Install dependencies
RUN npm install --force

# Build
RUN npm run build

# Copy docs to the correct location
RUN mkdir -p dist/docs && cp src/docs/apispec.yml dist/docs/

ENV NODE_ENV="production"

EXPOSE 3000

CMD [ "node", "dist/index.js" ]