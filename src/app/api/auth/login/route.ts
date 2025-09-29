import { NextResponse } from 'next/server';
import { BACKEND_API_URL, forwardJson } from '../../_lib';

export async function POST(request: Request) {
  const body = await request.json();
  const url = `${BACKEND_API_URL}/auth/login`;
  return forwardJson(url, { method: 'POST', body: JSON.stringify(body) });
}
