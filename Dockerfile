FROM node:latest
COPY . /app
WORKDIR /app
RUN rm -f src/.env
ENV production=TRUE
RUN npm install
RUN npx prisma generate
RUN npm run build
EXPOSE 80
CMD ["npm", "run", "start"]
