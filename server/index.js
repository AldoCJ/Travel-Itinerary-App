import express from "express";
import dotenv from "dotenv";
import { supabase } from "./supabaseClient.js"; // import your Supabase client
//import userRoutes from "./routes/users.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9000;

app.use(express.json()); // Middleware to parse JSON bodies


//function requireAuth(req, res, next) {
//    console.log("Authenticating user...");
//    next();
//}

//app.use(requireAuth); // Apply authentication middleware globally


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

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
