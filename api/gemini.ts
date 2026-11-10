
/// <reference types="node" />

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY is not configured',
    });
  }

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify(req.body),
      },
    );

    return res.status(response.status).json(await response.json());
  } catch {
    return res.status(500).json({
      error: 'Gemini request failed',
    });
  }
}
