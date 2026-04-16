async function loadOrders() {
  const ordersDiv = document.getElementById("orders");
  const messageDiv = document.getElementById("orders-message");

  try {
    showLoadingState(ordersDiv, "Loading orders...");
    const orders = await fetchJson(`${API_BASE}/orders`);
    clearMessage(messageDiv);

    if (!orders.length) {
      renderEmptyState(ordersDiv, "No orders yet.", "Orders will appear here after checkout.");
      return;
    }

    renderCards(ordersDiv, orders, (order) => `
        <p>ID: ${order.id}</p>
        <p>Product ID: ${order.product_id}</p>
        <p>Quantity: ${order.quantity}</p>
        <p>Total Price: ${formatCurrency(order.total_price)}</p>
        <p>Created At: ${formatDateTime(order.created_at)}</p>
      `);
  } catch (error) {
    setMessage(messageDiv, "Could not load orders.", "error");
    renderEmptyState(ordersDiv, "Unable to load orders.", "Please refresh and try again.");
  }
}

document.getElementById("refresh-orders").addEventListener("click", loadOrders);

loadOrders();
