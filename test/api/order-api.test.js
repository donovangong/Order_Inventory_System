const assert = require("assert");
const test = require("node:test");
const {
  ORDER_SERVICE_URL,
  request,
  assertStatus,
  assertJsonArray
} = require("../helpers/http");

test("order service health endpoint returns ok", async () => {
  const response = await assertStatus(ORDER_SERVICE_URL, "/health", 200);

  assert.strictEqual(response.body.status, "ok");
  assert.strictEqual(response.body.service, "order-service");
});

test("GET /orders returns an array", async () => {
  const orders = await assertJsonArray(ORDER_SERVICE_URL, "/orders");

  assert.ok(Array.isArray(orders));
});

test("GET /api/orders supports ingress path prefix", async () => {
  const orders = await assertJsonArray(ORDER_SERVICE_URL, "/api/orders");

  assert.ok(Array.isArray(orders));
});

test("GET /orders/:id returns 404 for unknown order", async () => {
  const response = await assertStatus(ORDER_SERVICE_URL, "/orders/999999", 404);

  assert.ok(response.body.error);
});

test("POST /orders rejects missing product_id", async () => {
  const response = await request(ORDER_SERVICE_URL, "/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity: 1 })
  });

  assert.strictEqual(response.status, 400);
  assert.ok(response.body.error);
});

test("POST /orders rejects invalid quantity", async () => {
  const response = await request(ORDER_SERVICE_URL, "/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: 1, quantity: 0 })
  });

  assert.strictEqual(response.status, 400);
  assert.ok(response.body.error);
});

test("POST /orders returns an error for unknown product_id", async () => {
  const response = await request(ORDER_SERVICE_URL, "/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: 999999, quantity: 1 })
  });

  assert.ok(response.status >= 400);
  assert.ok(response.body.error);
});
