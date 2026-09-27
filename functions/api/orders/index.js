export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');

  if (!env.DB) {
    return Response.json({ orders: [] });
  }

  let stmt;
  if (userId) {
    stmt = env.DB.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').bind(userId);
  } else {
    stmt = env.DB.prepare('SELECT * FROM orders ORDER BY created_at DESC');
  }

  const { results } = await stmt.all();

  const orders = (results || []).map(row => ({
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
    services: JSON.parse(row.services || '[]'),
    items: JSON.parse(row.items || '[]'),
    subtotal: row.subtotal,
    deliveryFee: row.delivery_fee,
    discount: row.discount,
    total: row.total,
    paymentMethod: row.payment_method,
    specialInstructions: row.special_instructions,
    currentStageIndex: row.current_stage_index,
    status: row.status,
    driver: JSON.parse(row.driver || '{}'),
    createdAt: row.created_at
  }));

  return Response.json({ orders });
}

export async function onRequestPost(context) {
  const { env, request } = context;

  try {
    const body = await request.json();

    if (!body.customerName || !body.pickupAddress || !body.pickupDate) {
      return Response.json({ error: 'Customer name, pickup address, and date are required.' }, { status: 400 });
    }

    if (!env.DB) {
      return Response.json({ error: 'Database binding (DB) is not configured in Cloudflare Pages.' }, { status: 500 });
    }

    const orderId = 'AW-' + Math.floor(1000 + Math.random() * 9000);
    const driver = {
      name: 'Rohan Sharma',
      phone: '+91 98451 20412',
      rating: 4.95,
      reviewsCount: 420,
      vehicle: 'AuraWash EV Transit #08',
      etaMinutes: 30
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
      pickupAddress: body.pickupAddress,
      pickupDate: body.pickupDate,
      pickupTimeSlot: body.pickupTimeSlot,
      deliveryDate: body.deliveryDate,
      deliveryTimeSlot: body.deliveryTimeSlot,
      services: body.services || [],
      items: body.items || [],
      total: Number(body.total || 0),
      status: 'Pickup Scheduled',
      currentStageIndex: 1,
      driver
    };

    return Response.json({
      message: 'Pickup scheduled successfully!',
      order: createdOrder
    }, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
