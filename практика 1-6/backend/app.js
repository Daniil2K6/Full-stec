const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Swagger
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Products API',
      version: '1.0.0',
      description: 'Simple products API for practice',
    },
    servers: [{ url: `http://localhost:${port}` }],
  },
  apis: [path.join(__dirname, 'app.js')],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Простая CORS-поддержка
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json());

// Serve static assets (images etc.) from frontend assets folder
app.use('/assets', express.static(path.join(__dirname, '..', 'frontend', 'assets')));

let nextId = 1;
let products = [
  { id: nextId++, name: 'Умные часы', price: 12990, image: '/assets/images/watch.png' },
  { id: nextId++, name: 'Беспроводные наушники', price: 5990, image: '/assets/images/headphones.png' },
  { id: nextId++, name: 'Фитнес-браслет', price: 3490, image: '/assets/images/fitness.png' },
  { id: nextId++, name: 'Портативная колонка', price: 2490, image: '/assets/images/speaker.png' },
  { id: nextId++, name: 'Внешний SSD 512GB', price: 8990, image: '/assets/images/ssd.png' },
  { id: nextId++, name: 'USB-C кабель', price: 490, image: '/assets/images/cable.png' },
  { id: nextId++, name: 'Чехол для телефона', price: 790, image: '/assets/images/case.png' },
  { id: nextId++, name: 'Зарядное устройство 30W', price: 1790, image: '/assets/images/charger.png' },
  { id: nextId++, name: 'Клавиатура механическая', price: 4990, image: '/assets/images/keyboard.png' },
  { id: nextId++, name: 'Мышь беспроводная', price: 1690, image: '/assets/images/mouse.png' },
];

// GET all
app.get('/api/products', (req, res) => {
  res.json(products);
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         image:
 *           type: string
 *       example:
 *         id: 1
 *         name: "Умные часы"
 *         price: 12990
 *         image: "/assets/images/watch.png"
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */

// GET by id
app.get('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const item = products.find(p => p.id === id);
  if (!item) return res.status(404).json({ error: 'Product not found' });
  res.json(item);
});

// POST create
app.post('/api/products', (req, res) => {
  const { name, price, image } = req.body;
  if (!name || price === undefined) return res.status(400).json({ error: 'name and price required' });
  const product = { id: nextId++, name: String(name).trim(), price: Number(price), image: image || null };
  products.push(product);
  res.status(201).json(product);
});

// PATCH update
app.patch('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const product = products.find(p => p.id === id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  const { name, price, image } = req.body;
  if (name !== undefined) product.name = String(name).trim();
  if (price !== undefined) product.price = Number(price);
  if (image !== undefined) product.image = image;
  res.json(product);
});

// DELETE
app.delete('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const exists = products.some(p => p.id === id);
  if (!exists) return res.status(404).json({ error: 'Product not found' });
  products = products.filter(p => p.id !== id);
  res.status(204).send();
});

// simple health
app.get('/', (req, res) => res.send('Products API is running'));

app.listen(port, () => {
  console.log(`Products API listening at http://localhost:${port}`);
});
