export async function onRequestPost(context) {
  const { env, request } = context;

  try {
    const { name, email, password, phone, address, notes } = await request.json();

    if (!email || !password || !name) {
      return Response.json({ error: 'Name, email, and password are required.' }, { status: 400 });
    }

    if (!env.DB) {
      return Response.json({ error: 'Database binding (DB) is not configured in Cloudflare Pages.' }, { status: 500 });
    }

    // Check if email already exists
    const existing = await env.DB.prepare('SELECT id FROM users WHERE LOWER(email) = LOWER(?)')
      .bind(email)
      .first();

    if (existing) {
      return Response.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }

    const userId = 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

    await env.DB.prepare(`
      INSERT INTO users (id, name, email, password, phone, address, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(userId, name, email, password, phone || '', address || '', notes || '').run();

    const user = {
      id: userId,
      name,
      email,
      phone: phone || '',
      address: address || '',
      notes: notes || ''
    };

    return Response.json({
      message: 'Account created successfully',
      user,
      token: 'jwt_mock_' + userId
    }, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
