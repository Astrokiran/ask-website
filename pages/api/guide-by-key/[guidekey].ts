import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { guideKey } = req.query;

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  if (!guideKey || typeof guideKey !== 'string') {
    return res.status(400).json({ error: 'Guide key is required in path and must be a string' });
  }

  const djangoApiUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL;
  if (!djangoApiUrl) {
    console.error("CRITICAL: NEXT_PUBLIC_DJANGO_API_URL environment variable is not set.");
    return res.status(500).json({ error: 'API configuration error on server' });
  }

  try {
    // This URL must exactly match how your Django backend exposes the validate_guide_booking_key view
    const backendUrl = `${djangoApiUrl}/api/guides/validate-key/${guideKey}/`;

    console.log(`Proxying to Django: ${backendUrl}`); // For debugging in deployment logs

    const backendResponse = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any other headers your Django backend might expect
      },
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      console.error(`Django backend error: ${backendResponse.status}`, data);
      return res.status(backendResponse.status).json(
        { error: data.error || data.detail || 'Failed to validate guide key (from backend)' }
      );
    }

    return res.status(backendResponse.status).json(data);

  } catch (error) {
    let errorMessage = 'Internal server error while contacting backend API';
    if (error instanceof Error) {
      console.error('Error proxying to Django API:', error.message, error.stack);
      errorMessage = `Failed to connect to backend: ${error.message}`;
    } else {
      console.error('Unknown error proxying to Django API:', error);
    }
    return res.status(500).json({ error: 'Internal server error while contacting backend API' });
  }
}
