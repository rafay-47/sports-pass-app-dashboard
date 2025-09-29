export const BACKEND_API_URL = process.env.BACKEND_API_URL || 'https://sports-pass-app-backend.onrender.com/api';

export async function forwardJson(url: string, init: RequestInit) {
  console.log('forwardJson - Making request to:', url);
  console.log('forwardJson - Request headers:', init.headers);
  console.log('forwardJson - Request method:', init.method || 'GET');
  if (init.body) {
    console.log('forwardJson - Request body:', init.body);
  }
  
  const res = await fetch(url, {
    ...init,
    headers: {
      ...(init.headers || {}),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
  
  console.log('forwardJson - Response status:', res.status);
  console.log('forwardJson - Response headers:', Object.fromEntries(res.headers.entries()));

  const text = await res.text();
  console.log('forwardJson - Response body text:', text);
  
  try {
    const json = text ? JSON.parse(text) : {};
    console.log('forwardJson - Parsed JSON response:', JSON.stringify(json, null, 2));
    return new Response(JSON.stringify(json), { status: res.status, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.log('forwardJson - Failed to parse JSON, returning text response');
    return new Response(text, { status: res.status });
  }
}
