exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const payload = JSON.parse(event.body);

    // Honeypot check
    if (payload.website) {
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    }

    // Basic validation
    if (!payload.email || !payload.name) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
    }

    // Forward to Make webhook (secret)
    const webhookUrl = process.env.MAKE_WEBHOOK_URL;
    if (!webhookUrl) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Server error' }) };
    }

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error('Webhook failed');

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };

  } catch(e) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Server error' }) };
  }
};
