# Use Node.js LTS as base image
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy all other source code to container
COPY . .

# Expose port (match your server.js port)
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
