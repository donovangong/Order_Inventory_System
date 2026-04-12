const assert = require("assert");

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || "http://localhost:3001";
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || "http://localhost:3002";
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

async function assertJsonArray(baseUrl, path) {
  const response = await request(baseUrl, path);
  assert.strictEqual(response.status, 200);
  assert.ok(Array.isArray(response.body), `${path} should return an array`);
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
  ADMIN_USER,
  ADMIN_PASSWORD,
  request,
  assertJsonArray,
  adminHeaders
};
