# Step 1: Use the official Node.js image from Docker Hub
FROM node:16

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (if available)
COPY package*.json ./
COPY .env .env

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of your application files into the container
COPY . .

# Step 6: Expose the port that your app will run on
EXPOSE 5000

# Step 7: Define the command to run your application
CMD ["npm", "start"]
