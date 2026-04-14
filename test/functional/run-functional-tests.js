const path = require("path");

const testFiles = [
  path.join(__dirname, "frontend", "frontend-behavior.test.js")
];

for (const file of testFiles) {
  require(file);
}
