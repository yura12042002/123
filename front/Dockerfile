# build environment
FROM node as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent
RUN npm install react-scripts --silent
COPY . ./
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npm run build

FROM mhart/alpine-node
RUN yarn global add serve
WORKDIR /app
COPY --from=build /app/build .
EXPOSE 8888
CMD ["serve", "-p", "3000", "-s", "."]