
# Book Review Service

This project is a **Book Review Service** built using Node.js, Express, MongoDB, and Redis. The application allows users to manage and review books. 

## Features
- RESTful APIs for book management.
- MongoDB for database storage.
- Redis for caching and session management.
- Docker support for containerized deployment.

---

## Prerequisites

1. **Node.js**: Ensure Node.js is installed on your system. You can download it from [Node.js official website](https://nodejs.org/).
2. **MongoDB**: Have a running instance of MongoDB.
3. **Redis**: Have Redis server running on your local machine or use a cloud-based Redis instance.
4. **Docker**: Install Docker if you want to run the application in a containerized environment.

---

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/Hedi-Ayari/book-review-servicee.git
cd book-review-servicee
```

### 2. Set Up Environment Variables
Create a `.env` file in the root of the project and configure the following:
```env
MONGO_URI=mongodb://<your-mongo-uri>
REDIS_HOST=localhost
REDIS_PORT=6379
PORT=5000
JWT_SECRET=your_jwt_secret
```

---

## Running the Application

### A. Running Locally

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Application**
   - In production mode:
     ```bash
     npm start
     ```
   - In development mode (with hot-reloading):
     ```bash
     npm run dev
     ```

3. **Access the Application**
   The app will run on `http://localhost:5000`.

---

### B. Running with Docker

1. **Build the Docker Image**
   ```bash
   docker build -t book-review-service .
   ```

2. **Run the Docker Container**
   ```bash
   docker run --env-file .env -p 5000:5000 book-review-service
   ```

3. **Access the Application**
   The app will be available at `http://localhost:5000`.

---

## Testing the Application

You can test the application using any API client like **Postman** or **cURL**.  
Swagger documentation is available at `http://localhost:5000/api-docs` (if configured).

---

## Additional Notes

- **Redis:** Ensure Redis is running before starting the application. You can start it with:
  ```bash
  redis-server
  ```

- **MongoDB:** Make sure MongoDB is running and accessible at the `MONGO_URI` specified in `.env`.

- **Stopping Docker Containers:** To stop the running container, use:
  ```bash
  docker ps          # Get the container ID
  docker stop <container-id>
  ```

---

## Troubleshooting

- **Docker Build Fails:** Ensure `.env` exists and all necessary files are included in the build context.
- **Redis Connection Issues:** Verify Redis is running and accessible at the specified host and port.

---

## License
This project is licensed under the MIT License. See the LICENSE file for details.
