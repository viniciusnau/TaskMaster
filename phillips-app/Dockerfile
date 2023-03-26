# Base image
FROM node:14.16.0-alpine3.13 AS base
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install
RUN npm install react-scripts@4.0.3 -g

# Copy app source
COPY . .

# Build app
RUN npm run build

# Production image
FROM nginx:1.19.8-alpine
COPY --from=base /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
