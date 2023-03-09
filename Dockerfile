FROM node:latest
COPY . /app
WORKDIR /app
RUN rm src/.env
ENV production=TRUE
RUN npm install
RUN npx prisma generate
RUN npm run build
EXPOSE 80
RUN rm -rf src
CMD ["npm", "run", "start"]