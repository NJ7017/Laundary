/**
 * AuraWash Cloudflare Worker
 * Handles API routes (/api/*) with Cloudflare D1 Database
 * Serves SPA frontend assets via Workers Static Assets
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

const SERVICEABLE_PINS = [
  '411057', '411045', '411027', '411028', '411038', '411033', '411014', '411001',
  '560001', '560100', '560066', '400001', '400050', '110001', '122001', '500081'
];

function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
      ...extraHeaders,
    },
  });
}

function parseJsonSafe(val, fallback) {
  if (!val) return fallback;
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

function formatOrder(row) {
  return {
    id: row.id,
    userId: row.user_id,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    pickupAddress: row.pickup_address,
    pickupDate: row.pickup_date,
    pickupTimeSlot: row.pickup_time_slot,
    deliveryDate: row.delivery_date,
    deliveryTimeSlot: row.delivery_time_slot,
    services: parseJsonSafe(row.services, []),
    items: parseJsonSafe(row.items, []),
    subtotal: Number(row.subtotal || 0),
    deliveryFee: Number(row.delivery_fee || 0),
    discount: Number(row.discount || 0),
    total: Number(row.total || 0),
    paymentMethod: row.payment_method,
    specialInstructions: row.special_instructions,
    currentStageIndex: row.current_stage_index,
    status: row.status,
    driver: parseJsonSafe(row.driver, {}),
    createdAt: row.created_at,
  };
}

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS,
      });
    }

    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method.toUpperCase();

    try {
      // 1. Coverage Check (/api/coverage/:zip)
      const coverageMatch = path.match(/^\/api\/coverage\/([^/]+)$/);
      if (coverageMatch && method === 'GET') {
        const pin = decodeURIComponent(coverageMatch[1]).trim();
        const serviceable = SERVICEABLE_PINS.includes(pin);
        return jsonResponse({
          zip: pin,
          serviceable,
          message: serviceable
            ? `Great news! AuraWash electric vans service PIN ${pin}.`
            : 'We have not expanded to this PIN code yet, but join our waiting list for updates!',
        });
      }

      // 2. Platform Stats (/api/stats)
      if (path === '/api/stats' && method === 'GET') {
        return jsonResponse({
          ordersCompleted: '48,250+',
          ecoWaterGallonsSaved: '320,000+',
          satisfactionRate: '99.4%',
          averageTurnaroundHours: '24 hrs',
        });
      }

      // 3. User Authentication - Sign Up (/api/auth/signup)
      if (path === '/api/auth/signup' && method === 'POST') {
        if (!env.DB) {
          return jsonResponse({ error: 'Database binding (DB) is not configured.' }, 500);
        }

        const body = await request.json().catch(() => ({}));
        const { name, email, password, phone, address, notes } = body;

        if (!email || !password || !name) {
          return jsonResponse({ error: 'Name, email, and password are required.' }, 400);
        }

        const existing = await env.DB.prepare('SELECT id FROM users WHERE LOWER(email) = LOWER(?)')
          .bind(email.trim())
          .first();

        if (existing) {
          return jsonResponse({ error: 'An account with this email already exists.' }, 409);
        }

        const userId = 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

        await env.DB.prepare(`
          INSERT INTO users (id, name, email, password, phone, address, notes)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).bind(
          userId,
          name.trim(),
          email.trim().toLowerCase(),
          password,
          phone || '',
          address || '',
          notes || ''
        ).run();

        const user = {
          id: userId,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone || '',
          address: address || '',
          notes: notes || '',
        };

        return jsonResponse({
          message: 'Account created successfully',
          user,
          token: 'jwt_mock_' + userId,
        }, 201);
      }

      // 4. User Authentication - Login (/api/auth/login)
      if (path === '/api/auth/login' && method === 'POST') {
        if (!env.DB) {
          return jsonResponse({ error: 'Database binding (DB) is not configured.' }, 500);
        }

        const body = await request.json().catch(() => ({}));
        const { email, password } = body;

        if (!email || !password) {
          return jsonResponse({ error: 'Email and password are required.' }, 400);
        }

        const user = await env.DB.prepare('SELECT id, name, email, password, phone, address, notes FROM users WHERE LOWER(email) = LOWER(?)')
          .bind(email.trim())
          .first();

        if (!user || user.password !== password) {
          return jsonResponse({ error: 'Invalid email or password.' }, 401);
        }

        const { password: _, ...safeUser } = user;

        return jsonResponse({
          message: 'Logged in successfully',
          user: safeUser,
          token: 'jwt_mock_' + user.id,
        });
      }

      // 5. Current Authenticated User (/api/auth/me)
      if (path === '/api/auth/me' && method === 'GET') {
        if (!env.DB) {
          return jsonResponse({ error: 'Database binding (DB) is not configured.' }, 500);
        }

        const authHeader = request.headers.get('Authorization') || '';
        if (!authHeader) {
          return jsonResponse({ error: 'Not authenticated' }, 401);
        }

        const token = authHeader.replace(/^Bearer\s+/i, '');
        const userId = token.replace('jwt_mock_', '');

        const user = await env.DB.prepare('SELECT id, name, email, phone, address, notes FROM users WHERE id = ?')
          .bind(userId)
          .first();

        if (!user) {
          return jsonResponse({ error: 'User not found' }, 401);
        }

        const { password: _, ...safeUser } = user;
        return jsonResponse({ user: safeUser });
      }

      // 6. Orders List & Filter by User (/api/orders)
      if (path === '/api/orders' && method === 'GET') {
        if (!env.DB) {
          return jsonResponse({ orders: [] });
        }

        const userId = url.searchParams.get('userId');
        let stmt;
        if (userId) {
          stmt = env.DB.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').bind(userId);
        } else {
          stmt = env.DB.prepare('SELECT * FROM orders ORDER BY created_at DESC');
        }

        const { results } = await stmt.all();
        const orders = (results || []).map(formatOrder);
        return jsonResponse({ orders });
      }

      // 7. Create New Order (/api/orders)
      if (path === '/api/orders' && method === 'POST') {
        if (!env.DB) {
          return jsonResponse({ error: 'Database binding (DB) is not configured.' }, 500);
        }

        const body = await request.json().catch(() => ({}));

        if (!body.customerName || !body.pickupAddress || !body.pickupDate) {
          return jsonResponse({ error: 'Customer name, pickup address, and date are required.' }, 400);
        }

        const orderId = 'AW-' + Math.floor(1000 + Math.random() * 9000);
        const driver = {
          name: 'Rohan Sharma',
          phone: '+91 98451 20412',
          rating: 4.95,
          reviewsCount: 420,
          vehicle: 'AuraWash EV Transit #08',
          etaMinutes: 30,
        };

        await env.DB.prepare(`
          INSERT INTO orders (
            id, user_id, customer_name, customer_email, customer_phone,
            pickup_address, pickup_date, pickup_time_slot, delivery_date,
            delivery_time_slot, services, items, subtotal, delivery_fee,
            discount, total, payment_method, special_instructions,
            current_stage_index, status, driver
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          orderId,
          body.userId || 'usr_guest',
          body.customerName,
          body.customerEmail || 'guest@aurawash.com',
          body.customerPhone || '+91 98765 43210',
          body.pickupAddress,
          body.pickupDate,
          body.pickupTimeSlot || 'Morning (8:00 AM - 11:00 AM)',
          body.deliveryDate || body.pickupDate,
          body.deliveryTimeSlot || 'Afternoon (1:00 PM - 4:00 PM)',
          JSON.stringify(body.services || ['Wash & Fold']),
          JSON.stringify(body.items || []),
          Number(body.subtotal || 0),
          Number(body.deliveryFee || 0),
          Number(body.discount || 0),
          Number(body.total || 0),
          body.paymentMethod || 'UPI / Cash on Delivery',
          body.specialInstructions || '',
          1,
          'Pickup Scheduled',
          JSON.stringify(driver)
        ).run();

        const createdOrder = {
          id: orderId,
          userId: body.userId || 'usr_guest',
          customerName: body.customerName,
          customerEmail: body.customerEmail || 'guest@aurawash.com',
          customerPhone: body.customerPhone || '+91 98765 43210',
          pickupAddress: body.pickupAddress,
          pickupDate: body.pickupDate,
          pickupTimeSlot: body.pickupTimeSlot || 'Morning (8:00 AM - 11:00 AM)',
          deliveryDate: body.deliveryDate || body.pickupDate,
          deliveryTimeSlot: body.deliveryTimeSlot || 'Afternoon (1:00 PM - 4:00 PM)',
          services: body.services || ['Wash & Fold'],
          items: body.items || [],
          subtotal: Number(body.subtotal || 0),
          deliveryFee: Number(body.deliveryFee || 0),
          discount: Number(body.discount || 0),
          total: Number(body.total || 0),
          paymentMethod: body.paymentMethod || 'UPI / Cash on Delivery',
          specialInstructions: body.specialInstructions || '',
          status: 'Pickup Scheduled',
          currentStageIndex: 1,
          driver,
          createdAt: new Date().toISOString(),
        };

        return jsonResponse({
          message: 'Pickup scheduled successfully!',
          order: createdOrder,
        }, 201);
      }

      // 8. Cancel Order (/api/orders/:id/cancel)
      const cancelMatch = path.match(/^\/api\/orders\/([^/]+)\/cancel$/);
      if (cancelMatch && method === 'PATCH') {
        if (!env.DB) {
          return jsonResponse({ error: 'Database binding (DB) is not configured.' }, 500);
        }

        const orderId = decodeURIComponent(cancelMatch[1]);
        const existing = await env.DB.prepare('SELECT id FROM orders WHERE LOWER(id) = LOWER(?)')
          .bind(orderId)
          .first();

        if (!existing) {
          return jsonResponse({ error: 'Order not found' }, 404);
        }

        await env.DB.prepare("UPDATE orders SET status = 'Cancelled', current_stage_index = -1 WHERE LOWER(id) = LOWER(?)")
          .bind(orderId)
          .run();

        return jsonResponse({ message: 'Order has been cancelled.' });
      }

      // 9. Get Single Order by ID (/api/orders/:id)
      const orderMatch = path.match(/^\/api\/orders\/([^/]+)$/);
      if (orderMatch && method === 'GET') {
        if (!env.DB) {
          return jsonResponse({ error: 'Database binding (DB) is not configured.' }, 500);
        }

        const orderId = decodeURIComponent(orderMatch[1]);
        const row = await env.DB.prepare('SELECT * FROM orders WHERE LOWER(id) = LOWER(?)')
          .bind(orderId)
          .first();

        if (!row) {
          return jsonResponse({ error: `Order ${orderId} not found.` }, 404);
        }

        return jsonResponse({ order: formatOrder(row) });
      }

      // 10. Contact Inquiries (/api/contact)
      if (path === '/api/contact' && method === 'POST') {
        const body = await request.json().catch(() => ({}));
        const { name, email, phone, subject, message } = body;

        if (!name || !email || !message) {
          return jsonResponse({ error: 'Name, email, and message are required.' }, 400);
        }

        if (env.DB) {
          const inqId = 'inq_' + Date.now().toString(36);
          await env.DB.prepare(`
            INSERT INTO inquiries (id, name, email, phone, subject, message)
            VALUES (?, ?, ?, ?, ?, ?)
          `).bind(inqId, name, email, phone || '', subject || '', message).run();
        }

        return jsonResponse({
          message: 'Thank you for reaching out! Our fabric care concierge will respond shortly.',
        }, 201);
      }

      // 11. Unmatched /api/* routes
      if (path.startsWith('/api/')) {
        return jsonResponse({ error: 'Endpoint not found' }, 404);
      }

      // Fallback for static assets if invoked through ASSETS binding
      if (env.ASSETS) {
        return env.ASSETS.fetch(request);
      }

      return new Response('Not found', { status: 404 });
    } catch (err) {
      const errorMsg = err.message || 'Internal Server Error';
      // Helpful hint if D1 tables haven't been seeded yet
      if (errorMsg.includes('no such table')) {
        return jsonResponse({
          error: 'Database table missing. Please initialize D1 using: npx wrangler d1 execute laundary-db --file=schema.sql --remote',
          details: errorMsg,
        }, 500);
      }
      return jsonResponse({ error: errorMsg }, 500);
    }
  },
};
