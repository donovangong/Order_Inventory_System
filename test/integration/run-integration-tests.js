const path = require("path");

const testFiles = [
  path.join(__dirname, "order-product-flow.test.js"),
  path.join(__dirname, "frontend-routing.test.js")
];

for (const file of testFiles) {
  require(file);
}
