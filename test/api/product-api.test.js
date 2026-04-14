const assert = require("assert");
const test = require("node:test");
const {
  PRODUCT_SERVICE_URL,
  request,
  assertStatus,
  assertJsonArray,
  adminHeaders
} = require("../helpers/http");

let product;
let originalProduct;

test.before(async () => {
  const products = await assertJsonArray(PRODUCT_SERVICE_URL, "/products");
  assert.ok(products.length > 0, "products endpoint should return seed data");

  product = products.reduce((lowest, item) => (item.id < lowest.id ? item : lowest), products[0]);
  originalProduct = {
    price: Number(product.price),
    stock: Number(product.stock)
  };
});

test.after(async () => {
  if (!product || !originalProduct) {
    return;
  }

  await request(PRODUCT_SERVICE_URL, `/products/${product.id}`, {
    method: "PUT",
    headers: adminHeaders(),
    body: JSON.stringify(originalProduct)
  });
});

test("product service health endpoint returns ok", async () => {
  const response = await assertStatus(PRODUCT_SERVICE_URL, "/health", 200);

  assert.strictEqual(response.body.status, "ok");
  assert.strictEqual(response.body.service, "product-service");
});

test("GET /products returns product objects", async () => {
  const products = await assertJsonArray(PRODUCT_SERVICE_URL, "/products");

  assert.ok(products.length > 0);
  assert.ok(products.every((item) => item.id));
  assert.ok(products.every((item) => item.name));
  assert.ok(products.every((item) => item.price !== undefined));
  assert.ok(products.every((item) => item.stock !== undefined));
});

test("GET /api/products supports ingress path prefix", async () => {
  const products = await assertJsonArray(PRODUCT_SERVICE_URL, "/api/products");

  assert.ok(products.length > 0);
});

test("GET /products/:id returns one product", async () => {
  const response = await assertStatus(PRODUCT_SERVICE_URL, `/products/${product.id}`, 200);

  assert.strictEqual(response.body.id, product.id);
  assert.strictEqual(response.body.name, product.name);
});

test("GET /products/:id returns 404 for unknown product", async () => {
  const response = await assertStatus(PRODUCT_SERVICE_URL, "/products/999999", 404);

  assert.ok(response.body.error);
});

test("PUT /products/:id rejects missing admin credentials", async () => {
  const response = await request(PRODUCT_SERVICE_URL, `/products/${product.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(originalProduct)
  });

  assert.strictEqual(response.status, 401);
  assert.ok(response.body.error);
});

test("PUT /products/:id rejects invalid product data", async () => {
  const response = await request(PRODUCT_SERVICE_URL, `/products/${product.id}`, {
    method: "PUT",
    headers: adminHeaders(),
    body: JSON.stringify({ price: -1, stock: originalProduct.stock })
  });

  assert.strictEqual(response.status, 400);
  assert.ok(response.body.error);
});

test("PUT /products/:id updates product data with admin credentials", async () => {
  const updatedProduct = {
    price: originalProduct.price + 1,
    stock: originalProduct.stock + 2
  };

  const response = await request(PRODUCT_SERVICE_URL, `/products/${product.id}`, {
    method: "PUT",
    headers: adminHeaders(),
    body: JSON.stringify(updatedProduct)
  });

  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.id, product.id);
  assert.strictEqual(Number(response.body.price), updatedProduct.price);
  assert.strictEqual(Number(response.body.stock), updatedProduct.stock);
});
