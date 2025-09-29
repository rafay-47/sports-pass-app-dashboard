import { NextRequest } from 'next/server';
import { BACKEND_API_URL, forwardJson } from '../../_lib';

export async function GET(request: NextRequest) {
  try {
    const auth = request.headers.get('authorization') || '';
    //console.log("API Route /clubs/my-clubs - Received auth header:", auth);
    //console.log("API Route /clubs/my-clubs - Auth header exists:", !!auth);

    if (!auth) {
      //console.log("API Route /clubs/my-clubs - No auth header provided");
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
    //console.log("API Route /clubs/my-clubs - Extracted token:", token);

    // Forward to backend /clubs/my-clubs endpoint
    const backendUrl = `${BACKEND_API_URL}/clubs/my-clubs`;
    //console.log("API Route /clubs/my-clubs - Backend URL:", backendUrl);

    // Try with Bearer format first
    let response = await forwardJson(backendUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json'
      }
    });

    // If Bearer format fails, try without Bearer
    if (response.status === 401) {
      //console.log("API Route /clubs/my-clubs - Bearer format failed, trying without Bearer");
      response = await forwardJson(backendUrl, {
        method: 'GET',
        headers: {
          Authorization: token,
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json'
        }
      });
    }

    return response;
  } catch (error) {
    console.error('Error in /clubs/my-clubs GET route:', error);
    return new Response(JSON.stringify({
      status: 'error',
      message: 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}