const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = 3001;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const pool = new Pool({
  host: process.env.DB_HOST || "postgres",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "orders_db",
  port: 5432
});

app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", service: "product-service" });
  } catch (error) {
    console.error("Health check failed:", error.message);
    res.status(500).json({ status: "error" });
  }
});

app.get("/products", async (req, res) => {
  try {
    console.log("GET /products");
    const result = await pool.query("SELECT id, name, price, stock FROM products ORDER BY id");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    console.log("GET /products/:id", req.params.id);
    const result = await pool.query(
      "SELECT id, name, price, stock FROM products WHERE id = $1",
      [req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching product:", error.message);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

app.listen(port, () => {
  console.log(`product-service running on port ${port}`);
});
