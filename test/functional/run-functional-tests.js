const path = require("path");

const testFiles = [
  path.join("test", "functional", "api_test", "product-service.test.js"),
  path.join("test", "functional", "api_test", "order-service.test.js"),
  path.join("test", "functional", "frontend", "frontend-behavior.test.js")
];

for (const file of testFiles) {
  require(path.resolve(file));
}
