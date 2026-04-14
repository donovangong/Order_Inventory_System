const path = require("path");

const testFiles = [
  path.join("test", "api", "product-service-coverage.test.js"),
  path.join("test", "api", "order-service-coverage.test.js")
];

for (const file of testFiles) {
  require(path.resolve(file));
}
