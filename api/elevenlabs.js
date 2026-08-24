/**
 * Vercel Serverless Function — ElevenLabs TTS Proxy
 * Proxies TTS requests to ElevenLabs API without exposing the API key client-side.
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ElevenLabs API key not configured' });
  }

  try {
    const { text, voice_id, model_id, voice_settings } = req.body;

    if (!text || !voice_id) {
      return res.status(400).json({ error: 'Missing required fields: text, voice_id' });
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg',
        },
        body: JSON.stringify({
          text,
          model_id: model_id || 'eleven_multilingual_v2',
          voice_settings: voice_settings || {
            stability: 0.55,
            similarity_boost: 0.8,
            style: 0.4,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error('[ElevenLabs proxy error]', response.status, err);
      return res.status(response.status).json({ error: err });
    }

    const audioBuffer = await response.arrayBuffer();

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // cache 24h
    res.status(200).end(Buffer.from(audioBuffer));
  } catch (err) {
    console.error('[ElevenLabs proxy]', err);
    res.status(500).json({ error: err.message });
  }
}
