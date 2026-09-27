export async function onRequestPost(context) {
  const { env, request } = context;

  try {
    const { name, email, phone, subject, message } = await request.json();

    if (!name || !email || !message) {
      return Response.json({ error: 'Name, email, and message are required.' }, { status: 400 });
    }

    if (env.DB) {
      const inqId = 'inq_' + Date.now().toString(36);
      await env.DB.prepare(`
        INSERT INTO inquiries (id, name, email, phone, subject, message)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(inqId, name, email, phone || '', subject || '', message).run();
    }

    return Response.json({
      message: 'Thank you for reaching out! Our fabric care concierge will respond shortly.'
    }, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
