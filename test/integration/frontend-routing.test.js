const assert = require("assert");
const test = require("node:test");
const {
  FRONTEND_URL,
  PRODUCT_SERVICE_URL,
  ORDER_SERVICE_URL,
  request,
  assertJsonArray
} = require("../helpers/http");

test("frontend home page is served", async () => {
  const response = await request(FRONTEND_URL, "/");

  assert.strictEqual(response.status, 200);
  assert.strictEqual(typeof response.body, "string");
  assert.ok(response.body.includes("Order"));
  assert.ok(response.body.includes("app.js"));
});

test("frontend orders page is served", async () => {
  const response = await request(FRONTEND_URL, "/orders.html");

  assert.strictEqual(response.status, 200);
  assert.strictEqual(typeof response.body, "string");
  assert.ok(response.body.includes("orders.js"));
});

test("frontend management page is served", async () => {
  const response = await request(FRONTEND_URL, "/mgmt.html");

  assert.strictEqual(response.status, 200);
  assert.strictEqual(typeof response.body, "string");
  assert.ok(response.body.includes("mgmt.js"));
});

test("frontend-facing API routes return JSON arrays", async () => {
  const products = await assertJsonArray(PRODUCT_SERVICE_URL, "/api/products");
  const orders = await assertJsonArray(ORDER_SERVICE_URL, "/api/orders");

  assert.ok(products.length > 0);
  assert.ok(Array.isArray(orders));
});
