export async function onRequestPatch(context) {
  const { env, params } = context;
  const orderId = params.id;

  if (!env.DB) {
    return Response.json({ error: 'Database binding (DB) is not configured.' }, { status: 500 });
  }

  const existing = await env.DB.prepare('SELECT id FROM orders WHERE LOWER(id) = LOWER(?)')
    .bind(orderId)
    .first();

  if (!existing) {
    return Response.json({ error: 'Order not found' }, { status: 404 });
  }

  await env.DB.prepare("UPDATE orders SET status = 'Cancelled', current_stage_index = -1 WHERE LOWER(id) = LOWER(?)")
    .bind(orderId)
    .run();

  return Response.json({ message: 'Order has been cancelled.' });
}
