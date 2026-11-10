/// <reference types="node" />
import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });

  try {
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash', 
      contents: req.body.contents || req.body.prompt || req.body, 
    });

    return res.status(200).json(response);
  } catch (error: any) {
    console.error('Gemini Error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Gemini request failed',
    });
  }
}
