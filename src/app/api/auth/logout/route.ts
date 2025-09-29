import { NextResponse } from 'next/server';
import { BACKEND_API_URL, forwardJson } from '../../_lib';

export async function POST(request: Request) {
  const auth = request.headers.get('authorization') || '';
  const url = `${BACKEND_API_URL}/auth/logout`;
  return forwardJson(url, { method: 'POST', headers: { Authorization: auth } });
}
