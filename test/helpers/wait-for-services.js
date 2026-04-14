const {
  PRODUCT_SERVICE_URL,
  ORDER_SERVICE_URL,
  FRONTEND_URL,
  request
} = require("./http");

const timeoutMs = Number(process.env.TEST_WAIT_TIMEOUT_MS || 60000);
const intervalMs = Number(process.env.TEST_WAIT_INTERVAL_MS || 2000);

const targets = [
  { name: "product-service", baseUrl: PRODUCT_SERVICE_URL, path: "/health" },
  { name: "order-service", baseUrl: ORDER_SERVICE_URL, path: "/health" },
  { name: "frontend", baseUrl: FRONTEND_URL, path: "/" }
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForTarget(target) {
  const start = Date.now();
  let lastError = "";

  while (Date.now() - start < timeoutMs) {
    try {
      const response = await request(target.baseUrl, target.path);
      if (response.status >= 200 && response.status < 500) {
        console.log(`${target.name} is reachable at ${target.baseUrl}${target.path}`);
        return;
      }
      lastError = `HTTP ${response.status}`;
    } catch (error) {
      lastError = error.message;
    }

    await sleep(intervalMs);
  }

  throw new Error(`${target.name} did not become reachable: ${lastError}`);
}

(async () => {
  for (const target of targets) {
    await waitForTarget(target);
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
