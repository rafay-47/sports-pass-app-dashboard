import { NextRequest } from 'next/server';
import { BACKEND_API_URL, forwardJson } from '../../_lib';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const url = `${BACKEND_API_URL}/events/${id}`;
    console.log("API Route /events/[id] PUT - Backend URL:", url);
    console.log("API Route /events/[id] PUT - Request body:", JSON.stringify(body, null, 2));

    // Try with Bearer format first
    console.log("API Route /events/[id] PUT - Trying with Bearer format");
    let response = await forwardJson(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    console.log("API Route /events/[id] PUT - Response status with Bearer:", response.status);

    // Clone the response to read the body without consuming it
    const responseClone = response.clone();
    try {
      const responseText = await responseClone.text();
      console.log("API Route /events/[id] PUT - Response body:", responseText);
    } catch (bodyError) {
      console.log("API Route /events/[id] PUT - Could not read response body:", bodyError);
    }

    // If Bearer format fails, try without Bearer
    if (response.status === 401) {
      console.log("API Route /events/[id] PUT - Bearer format failed, trying without Bearer");
      response = await forwardJson(url, {
        method: 'PUT',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      console.log("API Route /events/[id] PUT - Response status without Bearer:", response.status);

      // Clone and read the new response body
      const responseClone2 = response.clone();
      try {
        const responseText2 = await responseClone2.text();
        console.log("API Route /events/[id] PUT - Response body without Bearer:", responseText2);
      } catch (bodyError2) {
        console.log("API Route /events/[id] PUT - Could not read response body:", bodyError2);
      }
    }

    console.log("API Route /events/[id] PUT - Final response status:", response.status);
    return response;
  } catch (error) {
    console.error('Error in events PUT route:', error);
    return new Response(JSON.stringify({
      status: 'error',
      message: 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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

    // Extract token from Bearer header
    let token = auth;
    if (auth.startsWith('Bearer ')) {
      token = auth.substring(7); // Remove 'Bearer ' prefix
    }

    const url = `${BACKEND_API_URL}/events/${id}`;
    console.log("API Route /events/[id] DELETE - Backend URL:", url);

    // Try with Bearer format first
    console.log("API Route /events/[id] DELETE - Trying with Bearer format");
    let response = await forwardJson(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log("API Route /events/[id] DELETE - Response status with Bearer:", response.status);

    // Clone the response to read the body without consuming it
    const responseClone = response.clone();
    try {
      const responseText = await responseClone.text();
      console.log("API Route /events/[id] DELETE - Response body:", responseText);
    } catch (bodyError) {
      console.log("API Route /events/[id] DELETE - Could not read response body:", bodyError);
    }

    // If Bearer format fails, try without Bearer
    if (response.status === 401) {
      console.log("API Route /events/[id] DELETE - Bearer format failed, trying without Bearer");
      response = await forwardJson(url, {
        method: 'DELETE',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        }
      });
      console.log("API Route /events/[id] DELETE - Response status without Bearer:", response.status);

      // Clone and read the new response body
      const responseClone2 = response.clone();
      try {
        const responseText2 = await responseClone2.text();
        console.log("API Route /events/[id] DELETE - Response body without Bearer:", responseText2);
      } catch (bodyError2) {
        console.log("API Route /events/[id] DELETE - Could not read response body:", bodyError2);
      }
    }

    console.log("API Route /events/[id] DELETE - Final response status:", response.status);
    return response;
  } catch (error) {
    console.error('Error in events DELETE route:', error);
    return new Response(JSON.stringify({
      status: 'error',
      message: 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}