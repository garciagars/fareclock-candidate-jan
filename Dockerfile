# Use official Node.js 22 LTS base image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy app source
COPY . .

# Set environment variables (optional)
ENV PORT=8080

# Expose the Cloud Run-required port
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
