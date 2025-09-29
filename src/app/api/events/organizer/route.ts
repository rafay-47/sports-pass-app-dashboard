import { NextRequest } from 'next/server';
import { BACKEND_API_URL, forwardJson } from '../../_lib';

export async function GET(request: NextRequest) {
  try {
    const auth = request.headers.get('authorization') || '';

    if (!auth) {
      return new Response(JSON.stringify({
        status: 'error',
        message: 'Authorization header is required'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    //Extract token from Bearer header
    let token = auth;
    if (auth.startsWith('Bearer ')) {
      token = auth.substring(7); // Remove 'Bearer ' prefix
    }

    const url = `${BACKEND_API_URL}/events/organizer`;
    console.log("API Route /events/organizer - Backend URL:", url);
    console.log("API Route /events/organizer - Original auth header:", auth);
    console.log("API Route /events/organizer - Extracted token:", token);
    
    // Try with Bearer format first
    console.log("API Route /events/organizer - Trying with Bearer format");
    let response = await forwardJson(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log("API Route /events/organizer - Response status with Bearer:", response.status);
    console.log("API Route /events/organizer - Response headers:", Object.fromEntries(response.headers.entries()));
    
    // Clone the response to read the body without consuming it
    const responseClone = response.clone();
    try {
      const responseText = await responseClone.text();
      console.log("API Route /events/organizer - Response body:", responseText);
    } catch (bodyError) {
      console.log("API Route /events/organizer - Could not read response body:", bodyError);
    }

    // If Bearer format fails, try without Bearer
    if (response.status === 401) {
      console.log("API Route /events/organizer - Bearer format failed, trying without Bearer");
      response = await forwardJson(url, {
        method: 'GET',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        }
      });
      console.log("API Route /events/organizer - Response status without Bearer:", response.status);
      
      // Clone and read the new response body
      const responseClone2 = response.clone();
      try {
        const responseText2 = await responseClone2.text();
        console.log("API Route /events/organizer - Response body without Bearer:", responseText2);
      } catch (bodyError2) {
        console.log("API Route /events/organizer - Could not read response body:", bodyError2);
      }
    }
    
    console.log("API Route /events/organizer - Final response status:", response.status);
    return response;
  } catch (error) {
    console.error('Error in events/organizer GET route:', error);
    return new Response(JSON.stringify({
      status: 'error',
      message: 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}