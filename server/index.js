import express from "express";
import dotenv from "dotenv";
import { supabase } from "./supabaseClient.js"; // import your Supabase client
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/authRoutes.js";

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

// Functions
const getProducts = async (req, res) => {
  const { data: products, error } = await supabase
    .from("products")
    .select("*");

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(products);
};

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/products", getProducts);
//app.use("/users", userRoutes);
app.use("/auth", authRoutes);

app.use(requireAuth); // Apply authentication middleware globally except for auth routes
app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
