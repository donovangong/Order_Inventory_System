const assert = require("assert");
const test = require("node:test");
const {
  PRODUCT_SERVICE_URL,
  request,
  assertJsonArray,
  adminHeaders
} = require("../helpers/http");

let testProduct;
let originalProduct;

test.before(async () => {
  const products = await assertJsonArray(PRODUCT_SERVICE_URL, "/products");
  assert.ok(products.length > 0, "products table should have seed data");
  testProduct = products[0];
  originalProduct = {
    price: Number(testProduct.price),
    stock: Number(testProduct.stock)
  };
});

test.after(async () => {
  if (!testProduct || !originalProduct) {
    return;
  }

  await request(PRODUCT_SERVICE_URL, `/products/${testProduct.id}`, {
    method: "PUT",
    headers: adminHeaders(),
    body: JSON.stringify(originalProduct)
  });
});

test("GET /health returns 200", async () => {
  const response = await request(PRODUCT_SERVICE_URL, "/health");

  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.status, "ok");
  assert.strictEqual(response.body.service, "product-service");
});

test("GET /products returns 200 and an array of products", async () => {
  const products = await assertJsonArray(PRODUCT_SERVICE_URL, "/products");

  assert.ok(products.length > 0);
  assert.ok(products[0].id);
  assert.ok(products[0].name);
  assert.ok(products[0].price !== undefined);
  assert.ok(products[0].stock !== undefined);
});

test("GET /api/products also returns products", async () => {
  const products = await assertJsonArray(PRODUCT_SERVICE_URL, "/api/products");

  assert.ok(products.length > 0);
});

test("PUT /products/:id rejects unauthorized requests", async () => {
  const response = await request(PRODUCT_SERVICE_URL, `/products/${testProduct.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ price: originalProduct.price, stock: originalProduct.stock })
  });

  assert.strictEqual(response.status, 401);
  assert.ok(response.body.error);
});

test("PUT /products/:id updates a product with admin headers", async () => {
  const updatedProduct = {
    price: originalProduct.price + 1,
    stock: originalProduct.stock + 2
  };

  const response = await request(PRODUCT_SERVICE_URL, `/products/${testProduct.id}`, {
    method: "PUT",
    headers: adminHeaders(),
    body: JSON.stringify(updatedProduct)
  });

  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.id, testProduct.id);
  assert.strictEqual(Number(response.body.price), updatedProduct.price);
  assert.strictEqual(Number(response.body.stock), updatedProduct.stock);
});

test("updated product data can be retrieved afterwards", async () => {
  const response = await request(PRODUCT_SERVICE_URL, `/products/${testProduct.id}`);

  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.id, testProduct.id);
  assert.strictEqual(Number(response.body.price), originalProduct.price + 1);
  assert.strictEqual(Number(response.body.stock), originalProduct.stock + 2);
});
