FROM node:20.10.0-alpine

# Set docker's working directory
WORKDIR /app/frontend

# Copy all files from current working directory to docker's working directory
COPY . .

# Install packages from package.json
RUN npm install

# Set port for client application
EXPOSE 3000

# Run application
CMD ["npm", "start"]