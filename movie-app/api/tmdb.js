// api/tmdb.js
export default async function handler(req, res) {
  try {
    // Use a server-side env var (DO NOT prefix with VITE_)
    const key = process.env.TMDB_V3_KEY || process.env.VITE_TMDB_API_KEY;
    if (!key) return res.status(500).json({ error: 'TMDB key not configured' });

    // allow client to request a TMDB endpoint: /api/tmdb?endpoint=trending/movie/week&page=1
    const endpoint = req.query.endpoint || 'trending/movie/week';
    const qs = Object.entries(req.query)
      .filter(([k]) => k !== 'endpoint')
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');

    const url = `https://api.themoviedb.org/3/${endpoint}${qs ? '?' + qs + '&' : '?' }api_key=${encodeURIComponent(key)}`;

    const tmdbRes = await fetch(url, {
      headers: { 'Content-Type': 'application/json' }
    });

    const body = await tmdbRes.text();
    res.status(tmdbRes.status).send(body);
  } catch (err) {
    console.error('tmdb proxy error', err);
    res.status(500).json({ error: err.message });
  }
}
