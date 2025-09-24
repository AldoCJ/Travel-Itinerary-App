import express from "express";
import dotenv from "dotenv";
import { supabase } from "./supabaseClient.js"; // import your Supabase client

dotenv.config();

console.log("URL:", process.env.SUPABASE_URL);
console.log("KEY:", process.env.SUPABASE_KEY ? "Loaded" : "Missing");


const app = express();
const PORT = process.env.PORT || 9000;

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

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
