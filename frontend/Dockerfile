# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set work directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package.json ./
# If you have a package-lock.json, copy it too for deterministic installs
COPY package-lock.json ./
# Or for yarn:
# COPY yarn.lock ./

# Install dependencies
RUN npm install
# Or for yarn:
# RUN yarn install

# Copy the rest of the application code
# The .dockerignore file will control what gets copied
COPY . .

# Expose port Next.js runs on
EXPOSE 3000

# The command to run the application will be specified in docker-compose.yml
# For reference, it would typically be:
# CMD ["npm", "run", "dev"]