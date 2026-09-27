export async function onRequestGet(context) {
  const { env, params } = context;
  const orderId = params.id;

  if (!env.DB) {
    return Response.json({ error: 'Database binding (DB) is not configured.' }, { status: 500 });
  }

  const row = await env.DB.prepare('SELECT * FROM orders WHERE LOWER(id) = LOWER(?)')
    .bind(orderId)
    .first();

  if (!row) {
    return Response.json({ error: `Order ${orderId} not found.` }, { status: 404 });
  }

  const order = {
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
  };

  return Response.json({ order });
}
