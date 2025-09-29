import { NextRequest } from 'next/server';
import { BACKEND_API_URL, forwardJson } from '../_lib';

export async function GET(request: NextRequest) {
  const url = new URL(`${BACKEND_API_URL}/tiers`);
  const incoming = new URL(request.url);
  incoming.searchParams.forEach((v, k) => url.searchParams.append(k, v));
  return forwardJson(url.toString(), { method: 'GET' });
}
