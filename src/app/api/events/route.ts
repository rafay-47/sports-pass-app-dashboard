import { NextRequest } from 'next/server';
import { BACKEND_API_URL, forwardJson } from '../_lib';

export async function POST(request: NextRequest) {
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

    const url = `${BACKEND_API_URL}/events`;
    console.log("API Route /events - Backend URL:", url);
    console.log("API Route /events - Original auth header:", auth);
    console.log("API Route /events - Extracted token:", token);
    console.log("API Route /events - Request body:", JSON.stringify(body, null, 2));
    
    // Try with Bearer format first
    console.log("API Route /events - Trying with Bearer format");
    let response = await forwardJson(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    
    console.log("API Route /events - Response status with Bearer:", response.status);
    console.log("API Route /events - Response headers:", Object.fromEntries(response.headers.entries()));
    
    // Clone the response to read the body without consuming it
    const responseClone = response.clone();
    try {
      const responseText = await responseClone.text();
      console.log("API Route /events - Response body:", responseText);
    } catch (bodyError) {
      console.log("API Route /events - Could not read response body:", bodyError);
    }

    // If Bearer format fails, try without Bearer
    if (response.status === 401) {
      console.log("API Route /events - Bearer format failed, trying without Bearer");
      response = await forwardJson(url, {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      console.log("API Route /events - Response status without Bearer:", response.status);
      
      // Clone and read the new response body
      const responseClone2 = response.clone();
      try {
        const responseText2 = await responseClone2.text();
        console.log("API Route /events - Response body without Bearer:", responseText2);
      } catch (bodyError2) {
        console.log("API Route /events - Could not read response body:", bodyError2);
      }
    }
    
    console.log("API Route /events - Final response status:", response.status);
    return response;
  } catch (error) {
    console.error('Error in events POST route:', error);
    return new Response(JSON.stringify({
      status: 'error',
      message: 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}