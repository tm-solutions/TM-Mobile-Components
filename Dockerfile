# Next 16 pide Node >= 20.9; se fija 22 LTS.
FROM node:22-alpine AS base

# 1. Instalar dependencias solo cuando cambian
FROM base AS deps
# Ver https://github.com/nodejs/docker-node#nodealpine para entender por que
# libc6-compat puede ser necesario.
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json ./
# --legacy-peer-deps: el arbol de react-native / react-native-web declara peers
# de React desalineados con React 19.
RUN npm ci --legacy-peer-deps

# 2. Compilar el codigo
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
# El build usa Webpack (--webpack en package.json), no Turbopack: ver el
# comentario en next.config.ts.
RUN npm run build

# 3. Imagen de produccion, solo lo que hace falta para correr next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public

# Aprovecha el output tracing para reducir el tamano de la imagen.
# Requiere output: "standalone" en next.config.ts
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
# 0.0.0.0 y no localhost: si no, el server solo escucha dentro del contenedor.
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
