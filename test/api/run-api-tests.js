const path = require("path");

const testFiles = [
  path.join("test", "api", "product-api.test.js"),
  path.join("test", "api", "order-api.test.js")
];

for (const file of testFiles) {
  require(path.resolve(file));
}
