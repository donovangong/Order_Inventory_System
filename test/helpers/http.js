const assert = require("assert");

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || "http://localhost:3001";
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || "http://localhost:3002";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:8080";
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";

function joinUrl(baseUrl, path) {
  return `${baseUrl.replace(/\/$/, "")}${path}`;
}

async function request(baseUrl, path, options = {}) {
  const response = await fetch(joinUrl(baseUrl, path), options);
  const text = await response.text();
  let body = null;

  if (text) {
    try {
      body = JSON.parse(text);
    } catch (error) {
      body = text;
    }
  }

  return {
    status: response.status,
    ok: response.ok,
    headers: response.headers,
    body
  };
}

async function assertStatus(baseUrl, path, expectedStatus, options = {}) {
  const response = await request(baseUrl, path, options);
  assert.strictEqual(response.status, expectedStatus, `${path} should return ${expectedStatus}`);
  return response;
}

async function assertJsonArray(baseUrl, path) {
  const response = await assertStatus(baseUrl, path, 200);
  assert.ok(Array.isArray(response.body), `${path} should return a JSON array`);
  return response.body;
}

function adminHeaders(extra = {}) {
  return {
    "Content-Type": "application/json",
    "x-admin-user": ADMIN_USER,
    "x-admin-password": ADMIN_PASSWORD,
    ...extra
  };
}

module.exports = {
  PRODUCT_SERVICE_URL,
  ORDER_SERVICE_URL,
  FRONTEND_URL,
  ADMIN_USER,
  ADMIN_PASSWORD,
  request,
  assertStatus,
  assertJsonArray,
  adminHeaders
};
