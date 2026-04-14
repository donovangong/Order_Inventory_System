const path = require("path");

const testFiles = [
  path.join(__dirname, "product-api.test.js"),
  path.join(__dirname, "order-api.test.js")
];

for (const file of testFiles) {
  require(file);
}
