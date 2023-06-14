# Use the official Node.js base image
FROM node:18.16

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build TypeScript files
RUN npm run build

# Start the application
# CMD npm start
CMD npm run dev