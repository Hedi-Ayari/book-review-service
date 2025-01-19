import express from "express";
import dotenv from "dotenv";
import routes from "./routes";
import { connectDB } from "./config/database";
import { initRedis, getRedisClient } from "./config/cache";
import { errorHandler } from "./middlewares/errorHandler";
import { swaggerSpec, swaggerUi } from "./swaggerConfig";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use("/apiSwagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Environment variable validation bch hata ken nsina bch nhtou el .env nalkaw errors wadhin ;)
const requiredEnvVariables = ["MONGO_URI", "REDIS_URL", "JWT_SECRET"];
for (const variable of requiredEnvVariables) {
  if (!process.env[variable]) {
    throw new Error(`Missing required environment variable: ${variable}`);
  }
}

connectDB();
initRedis();

app.use("/api", routes);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//  el shutdown function bch n7otou el server offline w n7otou el database w el cache offline bn to add here later el disconnectDB bn to add disconnect fel config
const shutdown = async () => {
  console.log("\nShutting down gracefully...");
  server.close(async () => {
    console.log("HTTP server closed.");
    // await disconnectDB();
    const redisClient = getRedisClient();
    await redisClient.disconnect();
    console.log("Database and cache connections closed.");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Handle uncaught errors
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});
