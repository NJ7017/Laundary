const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.API_PORT || 5000;

app.use(cors());
app.use(express.json());

// --- Authentication Endpoints ---
app.post('/api/auth/signup', (req, res) => {
  const { name, email, password, phone, address, notes } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const existing = db.findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  const user = db.createUser({
    name,
    email,
    password, // For local dev database
    phone: phone || '',
    address: address || '',
    notes: notes || ''
  });

  // Return safe user object
  const { password: _, ...safeUser } = user;
  res.status(201).json({
    message: 'Account created successfully',
    user: safeUser,
    token: 'jwt_mock_' + user.id
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = db.findUserByEmail(email);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const { password: _, ...safeUser } = user;
  res.json({
    message: 'Logged in successfully',
    user: safeUser,
    token: 'jwt_mock_' + user.id
  });
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const token = authHeader.replace('Bearer ', '');
  const userId = token.replace('jwt_mock_', '');
  const user = db.findUserById(userId);

  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  const { password: _, ...safeUser } = user;
  res.json({ user: safeUser });
});

// --- Orders Endpoints ---
app.get('/api/orders', (req, res) => {
  const userId = req.query.userId;
  const orders = db.getOrders(userId);
  res.json({ orders });
});

app.get('/api/orders/:id', (req, res) => {
  const order = db.getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: `Order ${req.params.id} not found.` });
  }
  res.json({ order });
});

app.post('/api/orders', (req, res) => {
  const {
    userId,
    customerName,
    customerEmail,
    customerPhone,
    pickupAddress,
    pickupDate,
    pickupTimeSlot,
    deliveryDate,
    deliveryTimeSlot,
    services,
    items,
    subtotal,
    deliveryFee,
    discount,
    total,
    paymentMethod,
    specialInstructions
  } = req.body;

  if (!customerName || !pickupAddress || !pickupDate || !pickupTimeSlot) {
    return res.status(400).json({ error: 'Missing required booking details (Name, Address, Pickup Schedule).' });
  }

  const newOrder = db.createOrder({
    userId: userId || 'usr_guest',
    customerName,
    customerEmail: customerEmail || 'guest@aurawash.com',
    customerPhone: customerPhone || '(555) 000-0000',
    pickupAddress,
    pickupDate,
    pickupTimeSlot,
    deliveryDate: deliveryDate || pickupDate,
    deliveryTimeSlot: deliveryTimeSlot || 'Afternoon (1:00 PM - 4:00 PM)',
    services: services || ['Wash & Fold'],
    items: items || [{ name: 'Standard Bag', quantity: 1, unit: 'bag', pricePerUnit: 25.00 }],
    subtotal: Number(subtotal || 25.00),
    deliveryFee: Number(deliveryFee || 0.00),
    discount: Number(discount || 0.00),
    total: Number(total || 25.00),
    paymentMethod: paymentMethod || 'Card on File',
    specialInstructions: specialInstructions || ''
  });

  res.status(201).json({
    message: 'Pickup scheduled successfully!',
    order: newOrder
  });
});

app.patch('/api/orders/:id/cancel', (req, res) => {
  const cancelled = db.cancelOrder(req.params.id);
  if (!cancelled) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json({ message: 'Order has been cancelled.', order: cancelled });
});

// --- Inquiries / Contact ---
app.post('/api/contact', (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }
  const saved = db.saveInquiry({ name, email, phone, subject, message });
  res.status(201).json({
    message: 'Thank you for reaching out! Our fabric care concierge will respond shortly.',
    inquiry: saved
  });
});

// --- Coverage Check ---
app.get('/api/coverage/:zip', (req, res) => {
  const isAvailable = db.checkZip(req.params.zip);
  res.json({
    zip: req.params.zip,
    serviceable: isAvailable,
    message: isAvailable
      ? 'Great news! AuraWash delivers white-glove laundry service in your neighborhood.'
      : 'We have not expanded to this zip code yet, but join our waiting list for updates!'
  });
});

// --- Platform Stats ---
app.get('/api/stats', (req, res) => {
  res.json({
    ordersCompleted: '48,250+',
    ecoWaterGallonsSaved: '320,000+',
    satisfactionRate: '99.4%',
    averageTurnaroundHours: '24 hrs'
  });
});

app.listen(PORT, () => {
  console.log(`AuraWash REST API running at http://localhost:${PORT}`);
});
