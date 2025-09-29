import { NextRequest } from 'next/server';
import { BACKEND_API_URL, forwardJson } from '../_lib';

export async function POST(request: NextRequest) {
  try {
    const auth = request.headers.get('authorization') || '';
    const body = await request.json();

    const url = `${BACKEND_API_URL}/clubs`;
    return forwardJson(url, {
      method: 'POST',
      headers: {
        Authorization: auth,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
  } catch (error) {
    console.error('Error in club POST route:', error);
    return new Response(JSON.stringify({
      status: 'error',
      message: 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = request.headers.get('authorization') || '';
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const clubId = pathParts[pathParts.length - 1];

    if (!clubId || clubId === 'club') {
      return new Response(JSON.stringify({
        status: 'error',
        message: 'Club ID is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    const backendUrl = `${BACKEND_API_URL}/clubs/${clubId}`;

    return forwardJson(backendUrl, {
      method: 'PUT',
      headers: {
        Authorization: auth,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
  } catch (error) {
    console.error('Error in club PUT route:', error);
    return new Response(JSON.stringify({
      status: 'error',
      message: 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = request.headers.get('authorization') || '';
    //console.log("API Route - Received auth header:", auth);
    //console.log("API Route - Auth header exists:", !!auth);
    const backendUrl = `${BACKEND_API_URL}/clubs`;
    //console.log("API Route - Backend URL:", backendUrl);

    if (!auth) {
      //console.log("API Route - No auth header provided");
      return new Response(JSON.stringify({
        status: 'error',
        message: 'Authorization header is required'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return forwardJson(backendUrl, {
      method: 'GET',
      headers: { 
        Authorization: auth,
        'X-Requested-With': 'XMLHttpRequest' // Laravel Sanctum often requires this
      }
    });
  } catch (error) {
    console.error('Error in club GET route:', error);
    return new Response(JSON.stringify({
      status: 'error',
      message: 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
