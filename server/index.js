import express from "express";
import dotenv from "dotenv";
import { supabase } from "./supabaseClient.js"; // import your Supabase client
import pool from "./database.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9000;

app.use(express.json()); // Middleware to parse JSON bodies

const requireAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: "Authorization header missing" });
    }
    const token = authHeader.split(" ")[1]; // Assuming "Bearer <token>"
    if (!token) {
        return res.status(401).json({ error: "Token missing" });
    }

    const { user, error } = await supabase.auth.getUser(token);
    if (error || !user) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }

    req.user = user; // Attach user info to request object
    next();
}


// Routes
app.use("/auth", authRoutes);
app.use("/trips", tripRoutes);
app.use("/users", userRoutes);
app.use(errorHandler);
app.use(requireAuth); // Apply authentication middleware globally except for auth routes

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  await pool.end();
  process.exit(0);
});
