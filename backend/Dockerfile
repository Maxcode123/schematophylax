# Build: install all dependencies and compile TypeScript to dist/.
FROM node:26-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
# --ignore-scripts skips the postinstall `prisma skills sync`, which only
# writes agent skill files and is not needed in the image.
RUN npm ci --ignore-scripts
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Runtime dependencies only.
FROM node:26-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts

FROM node:26-slim
ENV NODE_ENV=production
WORKDIR /app
COPY package.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
USER node
EXPOSE 8000
CMD ["node", "dist/main.js"]
