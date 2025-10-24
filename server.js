// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());

// Sample in-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// TODO: Implement the following routes:
// GET /api/products - Get all products
// GET /api/products/:id - Get a specific product
// POST /api/products - Create a new product
// PUT /api/products/:id - Update a product
// DELETE /api/products/:id - Delete a product

// GET /api/products - Get all products with filtering, pagination and search
app.get('/api/products', (req, res) => {
  let filteredProducts = [...products];
  const { category, search, page = 1, limit = 10 } = req.query;

  // Filter by category
  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }

  // Search by name
  if (search) {
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const totalProducts = filteredProducts.length;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  res.json({
    products: paginatedProducts,
    currentPage: parseInt(page),
    totalPages: Math.ceil(totalProducts / limit),
    totalProducts
  });
});

// GET /api/products/:id - Get a specific product
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// POST /api/products - Create a new product
app.post('/api/products', validateProductData, (req, res) => {
  const newProduct = {
    id: uuidv4(),
    ...req.body
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT /api/products/:id - Update a product
app.put('/api/products/:id', validateProductData, (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  products[index] = {
    ...products[index],
    ...req.body,
    id: req.params.id // preserve the original id
  };
  res.json(products[index]);
});

// DELETE /api/products/:id - Delete a product
app.delete('/api/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  const deletedProduct = products.splice(index, 1)[0];
  res.json({ message: 'Product deleted successfully', product: deletedProduct });
});

// GET /api/products/stats - Get product statistics
app.get('/api/stats', (req, res) => {
  const stats = {
    totalProducts: products.length,
    categoryCount: products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {}),
    inStockCount: products.filter(p => p.inStock).length,
    outOfStockCount: products.filter(p => !p.inStock).length,
    priceRange: {
      min: Math.min(...products.map(p => p.price)),
      max: Math.max(...products.map(p => p.price)),
      avg: products.reduce((sum, p) => sum + p.price, 0) / products.length
    }
  };
  res.json(stats);
});

// Custom logger middleware
const loggerMiddleware = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

// Authentication middleware
const authMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== 'your-api-key-here') {
    return res.status(401).json({ error: 'Unauthorized - Invalid API key' });
  }
  next();
};

// Validation middleware for product data
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

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    status: err.status || 500
  });
};

// Apply global middleware
app.use(loggerMiddleware);
app.use('/api', authMiddleware);
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app; 