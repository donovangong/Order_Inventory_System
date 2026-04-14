const { createApp } = require("./app");

const port = 3002;
const app = createApp();

app.listen(port, () => {
  console.log(`order-service running on port ${port}`);
});
