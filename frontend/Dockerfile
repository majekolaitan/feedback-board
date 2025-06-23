# Use an official Node.js runtime as a parent image
FROM node:18-alpine AS development

# Set work directory
WORKDIR /app

# Copy package.json and yarn.lock (or package-lock.json)
# COPY package.json yarn.lock* ./
# If using npm:
COPY package.json package-lock.json* ./

# Install dependencies
# RUN yarn install --frozen-lockfile
# If using npm:
RUN npm ci

# Copy the rest of the application code
COPY . .

# Expose port (Next.js dev server runs on this port by default)
EXPOSE 3000

# Command to run the Next.js development server
# CMD ["yarn", "dev"]
# If using npm:
CMD ["npm", "run", "dev"]

# --- Production Build Stage (Optional for now, but good to know) ---
# FROM node:18-alpine AS build
# WORKDIR /app
# COPY --from=development /app/node_modules ./node_modules
# COPY . .
# RUN yarn build

# FROM node:18-alpine AS production
# WORKDIR /app
# COPY --from=build /app/.next ./.next
# COPY --from=build /app/public ./public
# COPY --from=build /app/package.json ./package.json
# # If you have a custom server.js, copy it too
# EXPOSE 3000
# CMD ["yarn", "start"] # or "npx", "next", "start"