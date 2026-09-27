export async function onRequestPost(context) {
  const { env, request } = context;

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    if (!env.DB) {
      return Response.json({ error: 'Database binding (DB) is not configured in Cloudflare Pages.' }, { status: 500 });
    }

    const user = await env.DB.prepare('SELECT id, name, email, password, phone, address, notes FROM users WHERE LOWER(email) = LOWER(?)')
      .bind(email)
      .first();

    if (!user || user.password !== password) {
      return Response.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const { password: _, ...safeUser } = user;

    return Response.json({
      message: 'Logged in successfully',
      user: safeUser,
      token: 'jwt_mock_' + user.id
    });
  } catch (err) {
    return Response.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
