# Simple Shopping Cart API

A RESTful shopping cart backend built using **Node.js, Express, and MongoDB**, implemented with **ES Modules** and environment-based configuration.

---

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- Nodemon (development dependency)
- ES Modules (`type: module`)
- dotenv (environment configuration)

---

## Environment Variables

```env
PORT
MONGO_URI
```

---

## Project Structure

```
shopping-cart-api/
│
├── src/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── Product.js
│   │   └── Cart.js
│   ├── controllers/
│   │   ├── product.controller.js
│   │   └── cart.controller.js
│   ├── routes/
│   │   ├── product.routes.js
│   │   └── cart.routes.js
│   ├── app.js
│   └── server.js
│
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

## Setup & Run

### Installation

```bash
git clone <repository-url>
cd shopping-cart-api
npm install
```

### Start the Server

```bash
npm start
```

Server runs on:

```
http://localhost:5000
```

---

## API Endpoints

### Product APIs

| Method | Endpoint        | Description                       |
| ------ | --------------- | --------------------------------- |
| POST   | `/api/products` | Create a new product              |
| GET    | `/api/products` | Fetch all products (latest first) |

**Create Product – Sample Request**

```json
{
  "name": "Laptop",
  "price": 60000,
  "stock": 5
}
```

---

### Cart APIs

| Method | Endpoint            | Description               |
| ------ | ------------------- | ------------------------- |
| POST   | `/api/cart/add`     | Add product to cart       |
| PUT    | `/api/cart/update`  | Update cart item quantity |
| DELETE | `/api/cart/remove`  | Remove item from cart     |
| GET    | `/api/cart/summary` | Get cart summary          |

**Add to Cart – Sample Request**

```json
{
  "productId": "PRODUCT_ID",
  "quantity": 2
}
```

---

## Cart Calculation Logic

- **Subtotal** = Σ (product price × quantity)
- **Tax** = 5% of subtotal
- **Total** = subtotal + tax

Values are rounded to two decimal places.

---
