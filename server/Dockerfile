# Use Node.js 22 on Alpine Linux for a small, secure image
FROM node:22-alpine

# Create a directory for the application code
WORKDIR /app

# Copy dependency files first
COPY package*.json ./

# Install production and development dependencies
RUN npm install

# Copy the rest of your server-side code
COPY . .

# Document that the server uses port 4000
EXPOSE 4000

# The command to start your Express application
CMD ["npm", "start"]