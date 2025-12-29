# --- Stage 1: Build the Vite app ---
# Uses a light version of Node 22 to compile the code
FROM node:22-alpine AS builder

# Set the folder inside the container where commands will run
WORKDIR /app

# 1. Add these lines to accept the build-time argument
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Copy package files first to leverage Docker's "layer caching"
# (This makes subsequent builds faster if you haven't changed dependencies)
COPY package*.json ./

# Install the dependencies defined in package.json
RUN npm install

# Copy all the remaining source code from your computer to the container
COPY . .

# Run the build script (usually transforms React/Vite into static HTML/JS/CSS)
RUN npm run build

# --- Stage 2: Serve with Nginx ---
# We switch to a tiny Nginx image to serve the static files
FROM nginx:alpine

# Copy ONLY the 'dist' folder from the 'builder' stage into Nginx's public folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Inform Docker that this container listens on port 80
EXPOSE 80

# Start Nginx and keep it running in the foreground
CMD ["nginx", "-g", "daemon off;"]