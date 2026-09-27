const fs = require('fs');
const path = require('path');

const DB_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

const INITIAL_DATA = {
  users: [
    {
      id: 'usr_demo',
      name: 'Sarah Jenkins',
      email: 'demo@aurawash.com',
      password: 'password123',
      phone: '+91 98234 56789',
      address: 'Tower 4, Flat 602, Blue Ridge, Hinjawadi Phase 1, Pune, Maharashtra 411057',
      notes: 'Please leave bags with tower security or ring bell 602.',
      createdAt: '2026-09-01T10:00:00.000Z'
    }
  ],
  orders: [
    {
      id: 'AW-9482',
      userId: 'usr_demo',
      customerName: 'Sarah Jenkins',
      customerEmail: 'demo@aurawash.com',
      customerPhone: '+91 98234 56789',
      pickupAddress: 'Tower 4, Flat 602, Blue Ridge, Hinjawadi Phase 1, Pune, Maharashtra 411057',
      pickupDate: '2026-09-28',
      pickupTimeSlot: 'Morning (8:00 AM - 11:00 AM)',
      deliveryDate: '2026-09-29',
      deliveryTimeSlot: 'Afternoon (1:00 PM - 4:00 PM)',
      services: ['Wash & Fold', 'Botanical Eco-Wash'],
      items: [
        { name: 'Everyday Wash & Fold', quantity: 8, unit: 'kg', pricePerUnit: 89.00 },
        { name: 'Double Bed Blanket / Quilt', quantity: 1, unit: 'pcs', pricePerUnit: 299.00 },
        { name: 'Botanical Eco Sanitizer', quantity: 1, unit: 'load', pricePerUnit: 99.00 }
      ],
      subtotal: 1110.00,
      deliveryFee: 0.00,
      discount: 100.00,
      total: 1010.00,
      paymentMethod: 'UPI / GPay ending in 89',
      specialInstructions: 'Gentle cycle on comforter, lavender scented botanical wash.',
      currentStageIndex: 2,
      status: 'In Wash & Botanical Care',
      driver: {
        name: 'Rohan Sharma',
        phone: '+91 98451 20412',
        rating: 4.95,
        reviewsCount: 384,
        vehicle: 'AuraWash EV Delivery Van #08',
        etaMinutes: 35
      },
      createdAt: '2026-09-27T18:30:00.000Z'
    },
    {
      id: 'AW-8201',
      userId: 'usr_demo',
      customerName: 'Sarah Jenkins',
      customerEmail: 'demo@aurawash.com',
      customerPhone: '+91 98234 56789',
      pickupAddress: 'Tower 4, Flat 602, Blue Ridge, Hinjawadi Phase 1, Pune, Maharashtra 411057',
      pickupDate: '2026-09-26',
      pickupTimeSlot: 'Afternoon (1:00 PM - 4:00 PM)',
      deliveryDate: '2026-09-27',
      deliveryTimeSlot: 'Evening (5:00 PM - 8:00 PM)',
      services: ['Dry Cleaning', 'Steam Press'],
      items: [
        { name: 'Kurta & Blazer Suit', quantity: 2, unit: 'pcs', pricePerUnit: 199.00 },
        { name: 'Formal Shirts (Hung & Pressed)', quantity: 4, unit: 'pcs', pricePerUnit: 69.00 }
      ],
      subtotal: 674.00,
      deliveryFee: 0.00,
      discount: 0.00,
      total: 674.00,
      paymentMethod: 'UPI (PhonePe)',
      specialInstructions: 'Light starch on formal collars please.',
      currentStageIndex: 4,
      status: 'Out for Delivery',
      driver: {
        name: 'Amit Patil',
        phone: '+91 98112 38190',
        rating: 5.0,
        reviewsCount: 512,
        vehicle: 'AuraWash Electric Van #03',
        etaMinutes: 20
      },
      createdAt: '2026-09-26T12:00:00.000Z'
    },
    {
      id: 'AW-7110',
      userId: 'usr_demo',
      customerName: 'Sarah Jenkins',
      customerEmail: 'demo@aurawash.com',
      customerPhone: '+91 98234 56789',
      pickupAddress: 'Tower 4, Flat 602, Blue Ridge, Hinjawadi Phase 1, Pune, Maharashtra 411057',
      pickupDate: '2026-09-18',
      pickupTimeSlot: 'Morning (8:00 AM - 11:00 AM)',
      deliveryDate: '2026-09-19',
      deliveryTimeSlot: 'Morning (9:00 AM - 12:00 PM)',
      services: ['Wash & Fold'],
      items: [
        { name: 'Everyday Wash & Fold', quantity: 5, unit: 'kg', pricePerUnit: 89.00 }
      ],
      subtotal: 445.00,
      deliveryFee: 49.00,
      discount: 50.00,
      total: 444.00,
      paymentMethod: 'PayTM UPI',
      specialInstructions: 'Standard wash.',
      currentStageIndex: 5,
      status: 'Delivered',
      createdAt: '2026-09-18T09:00:00.000Z'
    }
  ],
  inquiries: [],
  serviceableZips: [
    '411057', '411045', '411027', '411028', '411038', '411033', '411014', '411001',
    '560001', '560100', '560066', '400001', '400050', '110001', '122001', '500081'
  ]
};

class LocalDB {
  constructor() {
    this.ensureDb();
  }

  ensureDb() {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    // Always write initial data if missing
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf8');
    }
  }

  resetSeed() {
    this.ensureDb();
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf8');
  }

  read() {
    this.ensureDb();
    try {
      const content = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(content);
    } catch (e) {
      console.error('Error reading db.json:', e);
      return INITIAL_DATA;
    }
  }

  write(data) {
    this.ensureDb();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  }

  // Users
  findUserByEmail(email) {
    const data = this.read();
    return data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id) {
    const data = this.read();
    return data.users.find(u => u.id === id);
  }

  createUser(userData) {
    const data = this.read();
    const newUser = {
      id: 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      ...userData,
      createdAt: new Date().toISOString()
    };
    data.users.push(newUser);
    this.write(data);
    return newUser;
  }

  // Orders
  getOrders(userId) {
    const data = this.read();
    if (userId) {
      return data.orders.filter(o => o.userId === userId || o.customerEmail === userId);
    }
    return data.orders;
  }

  getOrderById(id) {
    const data = this.read();
    return data.orders.find(o => o.id.toLowerCase() === id.toLowerCase());
  }

  createOrder(orderData) {
    const data = this.read();
    const trackingNum = 'AW-' + Math.floor(1000 + Math.random() * 9000);
    const newOrder = {
      id: trackingNum,
      currentStageIndex: 1, // Driver dispatched / scheduled
      status: 'Pickup Scheduled',
      driver: {
        name: 'Rohan Sharma',
        phone: '+91 98451 20412',
        rating: 4.95,
        reviewsCount: 420,
        vehicle: 'AuraWash Electric Van #04',
        etaMinutes: 30
      },
      createdAt: new Date().toISOString(),
      ...orderData
    };
    data.orders.unshift(newOrder);
    this.write(data);
    return newOrder;
  }

  cancelOrder(id) {
    const data = this.read();
    const idx = data.orders.findIndex(o => o.id.toLowerCase() === id.toLowerCase());
    if (idx !== -1) {
      data.orders[idx].status = 'Cancelled';
      data.orders[idx].currentStageIndex = -1;
      this.write(data);
      return data.orders[idx];
    }
    return null;
  }

  // Contact Inquiry
  saveInquiry(inquiry) {
    const data = this.read();
    const newInquiry = {
      id: 'inq_' + Date.now().toString(36),
      ...inquiry,
      createdAt: new Date().toISOString()
    };
    data.inquiries.push(newInquiry);
    this.write(data);
    return newInquiry;
  }

  checkZip(zip) {
    const data = this.read();
    const clean = (zip || '').trim();
    return data.serviceableZips.includes(clean);
  }
}

module.exports = new LocalDB();
