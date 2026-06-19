FROM public.ecr.aws/docker/library/node:22-alpine AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci
RUN npx prisma generate

FROM public.ecr.aws/docker/library/node:22-alpine AS production-dependencies-env
COPY ./package.json package-lock.json /app/
WORKDIR /app
RUN npm ci --omit=dev

FROM public.ecr.aws/docker/library/node:22-alpine AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN npm run build

FROM public.ecr.aws/docker/library/node:22-alpine
COPY ./package.json package-lock.json /app/
COPY ./prisma /app/prisma
COPY ./prisma.config.ts /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=development-dependencies-env /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=build-env /app/build /app/build
WORKDIR /app
CMD ["npm", "run", "start"]