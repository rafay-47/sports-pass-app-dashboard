import { NextRequest } from 'next/server';
import { BACKEND_API_URL, forwardJson } from '../../../_lib';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const auth = request.headers.get('authorization') || '';
    const body = await request.json();

    if (!auth) {
      return new Response(JSON.stringify({
        status: 'error',
        message: 'Authorization header is required'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Extract token from Bearer header
    let token = auth;
    if (auth.startsWith('Bearer ')) {
      token = auth.substring(7); // Remove 'Bearer ' prefix
    }

    const url = `${BACKEND_API_URL}/events/${id}/postpone`;
    console.log("API Route /events/[id]/postpone - Backend URL:", url);
    console.log("API Route /events/[id]/postpone - Original auth header:", auth);
    console.log("API Route /events/[id]/postpone - Extracted token:", token);
    console.log("API Route /events/[id]/postpone - Request body:", JSON.stringify(body, null, 2));

    // Try with Bearer format first
    console.log("API Route /events/[id]/postpone - Trying with Bearer format");
    let response = await forwardJson(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    console.log("API Route /events/[id]/postpone - Response status with Bearer:", response.status);
    console.log("API Route /events/[id]/postpone - Response headers:", Object.fromEntries(response.headers.entries()));

    // Clone the response to read the body without consuming it
    const responseClone = response.clone();
    try {
      const responseText = await responseClone.text();
      console.log("API Route /events/[id]/postpone - Response body:", responseText);
    } catch (bodyError) {
      console.log("API Route /events/[id]/postpone - Could not read response body:", bodyError);
    }

    // If Bearer format fails, try without Bearer prefix
    if (!response.ok && response.status !== 401) {
      console.log("API Route /events/[id]/postpone - Trying without Bearer format");
      response = await forwardJson(url, {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        }
      });

      console.log("API Route /events/[id]/postpone - Response status without Bearer:", response.status);
    }

    return response;
  } catch (error) {
    console.error('API Route /events/[id]/postpone - Error:', error);
    return new Response(JSON.stringify({
      status: 'error',
      message: 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}