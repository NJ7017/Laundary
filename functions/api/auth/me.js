export async function onRequestGet(context) {
  const { env, request } = context;

  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const token = authHeader.replace('Bearer ', '');
  const userId = token.replace('jwt_mock_', '');

  if (!env.DB) {
    return Response.json({ error: 'Database binding (DB) is not configured in Cloudflare Pages.' }, { status: 500 });
  }

  const user = await env.DB.prepare('SELECT id, name, email, phone, address, notes FROM users WHERE id = ?')
    .bind(userId)
    .first();

  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 401 });
  }

  return Response.json({ user });
}
