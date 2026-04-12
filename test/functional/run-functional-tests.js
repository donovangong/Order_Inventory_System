const path = require("path");

const testFiles = [
  path.join("test", "api_test", "product-service.test.js"),
  path.join("test", "api_test", "order-service.test.js"),
  path.join("test", "frontend", "frontend-behavior.test.js")
];

for (const file of testFiles) {
  require(path.resolve(file));
}
