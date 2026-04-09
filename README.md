# Order Inventory System

This is a small local project with:

- `frontend`: plain HTML/CSS/JS
- `product-service`: Express API for products
- `order-service`: Express API for orders
- `postgres`: database with sample data

## Run

```bash
docker-compose up
```

## URLs

- Frontend: `http://localhost:8080`
- Product service: `http://localhost:3001/products`
- Order service: `http://localhost:3002/orders`

## Environment variables

- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `PRODUCT_SERVICE_URL`

## Notes

- `order-service` calls `product-service` over HTTP
- product stock is reduced when an order is created
- everything is intentionally minimal for local testing
