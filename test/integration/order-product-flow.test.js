const assert = require("assert");
const test = require("node:test");
const {
  PRODUCT_SERVICE_URL,
  ORDER_SERVICE_URL,
  request,
  assertJsonArray,
  adminHeaders
} = require("../helpers/http");

let product;
let originalProduct;
let createdOrder;

test.before(async () => {
  const products = await assertJsonArray(PRODUCT_SERVICE_URL, "/products");
  const productsWithStock = products.filter((item) => Number(item.stock) > 0);

  assert.ok(productsWithStock.length > 0, "at least one product must have stock for integration tests");

  product = productsWithStock.reduce((highest, item) => (item.id > highest.id ? item : highest));

  originalProduct = {
    price: Number(product.price),
    stock: Number(product.stock)
  };
});

test.after(async () => {
  if (createdOrder) {
    await request(ORDER_SERVICE_URL, `/orders/${createdOrder.id}`, {
      method: "DELETE",
      headers: adminHeaders()
    });
  }

  if (!product || !originalProduct) {
    return;
  }

  await request(PRODUCT_SERVICE_URL, `/products/${product.id}`, {
    method: "PUT",
    headers: adminHeaders(),
    body: JSON.stringify(originalProduct)
  });
});

test("creating an order calculates total price and reduces product stock", async () => {
  const quantity = 1;

  const beforeResponse = await request(PRODUCT_SERVICE_URL, `/products/${product.id}`);
  assert.strictEqual(beforeResponse.status, 200);

  const stockBefore = Number(beforeResponse.body.stock);
  const priceBefore = Number(beforeResponse.body.price);

  const orderResponse = await request(ORDER_SERVICE_URL, "/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      product_id: product.id,
      quantity
    })
  });

  assert.strictEqual(orderResponse.status, 201);
  assert.ok(orderResponse.body.id);
  assert.strictEqual(orderResponse.body.product_id, product.id);
  assert.strictEqual(orderResponse.body.quantity, quantity);
  assert.strictEqual(Number(orderResponse.body.total_price), priceBefore * quantity);

  createdOrder = orderResponse.body;

  const afterResponse = await request(PRODUCT_SERVICE_URL, `/products/${product.id}`);
  assert.strictEqual(afterResponse.status, 200);
  assert.strictEqual(Number(afterResponse.body.stock), stockBefore - quantity);
});

test("created order can be retrieved from order service", async () => {
  assert.ok(createdOrder, "previous integration step should create an order");

  const orderResponse = await request(ORDER_SERVICE_URL, `/orders/${createdOrder.id}`);

  assert.strictEqual(orderResponse.status, 200);
  assert.strictEqual(orderResponse.body.id, createdOrder.id);
  assert.strictEqual(orderResponse.body.product_id, product.id);
});

test("order list contains the created order", async () => {
  assert.ok(createdOrder, "previous integration step should create an order");

  const orders = await assertJsonArray(ORDER_SERVICE_URL, "/orders");
  const match = orders.find((order) => order.id === createdOrder.id);

  assert.ok(match, "GET /orders should include the order created during integration test");
});

test("ordering more than available stock is rejected and does not change stock", async () => {
  const beforeResponse = await request(PRODUCT_SERVICE_URL, `/products/${product.id}`);
  assert.strictEqual(beforeResponse.status, 200);

  const stockBefore = Number(beforeResponse.body.stock);

  const orderResponse = await request(ORDER_SERVICE_URL, "/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      product_id: product.id,
      quantity: stockBefore + 1
    })
  });

  assert.strictEqual(orderResponse.status, 400);
  assert.ok(orderResponse.body.error);

  const afterResponse = await request(PRODUCT_SERVICE_URL, `/products/${product.id}`);
  assert.strictEqual(afterResponse.status, 200);
  assert.strictEqual(Number(afterResponse.body.stock), stockBefore);
});
