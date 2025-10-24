# Week 2: Express.js Server-Side Framework - Completed Assignment

## Implementation Overview

This assignment implements a RESTful API using Express.js with complete CRUD operations, middleware, error handling, and advanced features for a product management system.

## Features Implemented

### 1. Basic Express.js Setup ✅
- Initialized Node.js project
- Installed Express.js and dependencies (express, body-parser, uuid)
- Created Express server listening on port 3000
- Implemented root endpoint with welcome message

### 2. RESTful API Routes ✅

#### Product Schema
```javascript
{
  id: string (UUID),
  name: string,
  description: string,
  price: number,
  category: string,
  inStock: boolean
}
```

#### Implemented Routes
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get specific product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### 3. Middleware Implementation ✅

#### Logger Middleware
```javascript
const loggerMiddleware = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
```

#### Authentication Middleware
```javascript
const authMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== 'your-api-key-here') {
    return res.status(401).json({ error: 'Unauthorized - Invalid API key' });
  }
  next();
};
```

#### Validation Middleware
```javascript
const validateProductData = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;
  if (!name || !description || typeof price !== 'number' || !category) {
    return res.status(400).json({ 
      error: 'Validation Error',
      message: 'Required fields: name, description, price, category' 
    });
  }
  if (typeof inStock !== 'boolean') {
    req.body.inStock = true; // Default value
  }
  next();
};
```

### 4. Error Handling ✅
- Implemented global error handling middleware
- Added proper HTTP status codes
- Included validation error handling
- Set up async error handling

### 5. Advanced Features ✅

#### Product Filtering
- Filter by category: `GET /api/products?category=electronics`

#### Pagination
- Page-based pagination: `GET /api/products?page=1&limit=10`

#### Search Functionality
- Search by product name: `GET /api/products?search=laptop`

#### Statistics Endpoint
- Get product statistics: `GET /api/stats`
  ```javascript
  {
    totalProducts: number,
    categoryCount: { [category: string]: number },
    inStockCount: number,
    outOfStockCount: number,
    priceRange: {
      min: number,
      max: number,
      avg: number
    }
  }
  ```

## Testing Instructions

1. Install Dependencies:
```bash
npm install express body-parser uuid
```

2. Start the Server:
```bash
node server.js
```

3. Test API Endpoints:

### Create Product
```http
POST http://localhost:3000/api/products
Headers: 
  Content-Type: application/json
  X-API-Key: your-api-key-here

Body:
{
  "name": "Gaming Mouse",
  "description": "RGB gaming mouse with adjustable DPI",
  "price": 59.99,
  "category": "electronics",
  "inStock": true
}
```

### Get Products with Filters
```http
GET http://localhost:3000/api/products?category=electronics&search=gaming&page=1&limit=10
Headers:
  X-API-Key: your-api-key-here
```

### Update Product
```http
PUT http://localhost:3000/api/products/1
Headers:
  Content-Type: application/json
  X-API-Key: your-api-key-here

Body:
{
  "price": 69.99,
  "inStock": false
}
```

### Delete Product
```http
DELETE http://localhost:3000/api/products/1
Headers:
  X-API-Key: your-api-key-here
```

## Error Response Format
```javascript
{
  "error": "Error message",
  "status": 400 // HTTP status code
}
```

## Environment Variables
Created `.env.example` file with the following configuration:
```
PORT=3000
API_KEY=your-api-key-here
```

## Security Features
- API Key authentication for all /api routes
- Input validation for product creation/updates
- Proper error handling and status codes
- No sensitive data exposure

## Testing Tools
You can test the API using:
- Postman
- Insomnia
- cURL
- Any other HTTP client

This implementation fulfills all requirements from the Week 2 assignment, including proper RESTful API design, middleware implementation, error handling, and advanced features like filtering, pagination, and search functionality.