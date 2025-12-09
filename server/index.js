import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import { authMiddleware as requireAuth } from "./middleware/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9000;

app.use(express.json()); // Middleware to parse JSON bodies

// Routes
app.use("/auth", authRoutes);

app.use(requireAuth); // Apply authentication middleware globally except for auth routes

app.use("/trips", tripRoutes);
app.use("/users", userRoutes);
app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  process.exit(0);
});

process.on("unhandledRejection", err => {
  console.error("UNHANDLED REJECTION:", err);
});

process.on("uncaughtException", err => {
  console.error("UNCAUGHT EXCEPTION:", err);
});



