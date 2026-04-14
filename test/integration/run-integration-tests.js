const path = require("path");

const testFiles = [
  path.join("test", "integration", "order-product-flow.test.js"),
  path.join("test", "integration", "frontend-routing.test.js")
];

for (const file of testFiles) {
  require(path.resolve(file));
}
