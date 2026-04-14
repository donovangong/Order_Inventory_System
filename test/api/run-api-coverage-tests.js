const path = require("path");

const testFiles = [
  path.join(__dirname, "product-service-coverage.test.js"),
  path.join(__dirname, "order-service-coverage.test.js")
];

for (const file of testFiles) {
  require(file);
}
