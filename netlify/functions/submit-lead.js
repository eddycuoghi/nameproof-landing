exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const payload = JSON.parse(event.body || '{}');

    // Honeypot check
    if (payload.website) {
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    }

    // Basic validation: NameProof v1.0 collects an email and the name to assess.
    if (!payload.email || !payload.name) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
    }

    const fallbackAssessment = {
      assessment: {
        ai_recommendation: 'RECOMMENDED_WITH_CAUTION',
        final_recommendation: 'RECOMMENDED_WITH_CAUTION',
        confidence: 62,
        overall_risk: 'MEDIUM'
      },
      executive_summary: `${payload.name} shows promising brand potential, but some signals should be reviewed before you build around it.`,
      summary: `${payload.name} shows promising brand potential, but some signals should be reviewed before you build around it.`,
      signals: [
        { title: 'Brand Clarity', status: 'GOOD', message: 'Brand clarity looks promising.' },
        { title: 'SEO Collision Risk', status: 'WARNING', message: 'SEO collision requires deeper review.' },
        { title: 'Trademark Signals', status: 'WARNING', message: 'Trademark signals require professional clearance.' },
        { title: 'Domain & Social Availability', status: 'WARNING', message: 'Domain and social availability should be secured soon.' }
      ]
    };

    // Forward to Make webhook (secret). Make can either just store/send the lead,
    // or return a JSON assessment that the frontend will show on screen.
    const webhookUrl = process.env.MAKE_WEBHOOK_URL;
    if (!webhookUrl) {
      return { statusCode: 200, body: JSON.stringify({ ok: true, fallback: true, assessment: fallbackAssessment }) };
    }

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        request_type: payload.request_type || 'preliminary_name_assessment',
        product: 'NameProof',
        version: 'v1.0'
      })
    });

    if (!res.ok) {
      return { statusCode: 200, body: JSON.stringify({ ok: true, fallback: true, assessment: fallbackAssessment }) };
    }

    const text = await res.text();
    let makeData = null;
    try { makeData = text ? JSON.parse(text) : null; } catch(e) { makeData = null; }

    const assessment = makeData && (makeData.assessment || makeData.risk || makeData.summary || makeData.signals)
      ? (makeData.assessment || makeData)
      : fallbackAssessment;

    return { statusCode: 200, body: JSON.stringify({ ok: true, assessment }) };

  } catch(e) {
    return { statusCode: 200, body: JSON.stringify({ ok: true, assessment: {
      risk: 'MEDIUM',
      summary: 'This name shows promising brand potential, but some signals should be reviewed before you build around it.',
      signals: [
        'Brand clarity looks promising',
        'SEO collision requires deeper review',
        'Trademark signals require professional clearance',
        'Domain and social availability should be secured soon'
      ]
    } }) };
  }
};
