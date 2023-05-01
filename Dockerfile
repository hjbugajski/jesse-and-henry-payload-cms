FROM node:18-alpine as build
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /app
COPY ./.npmrc ./package.json ./yarn.lock ./tsconfig.json ./
ADD src /app/src
RUN yarn install --production
ENV PATH /app/node_modules/.bin:$PATH
RUN yarn build

FROM node:18-alpine
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /app
COPY --from=build /app ./
ENV PATH /app/node_modules/.bin:$PATH
EXPOSE 3000
CMD ["yarn", "serve"]
