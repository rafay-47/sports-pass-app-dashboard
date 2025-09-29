import { BACKEND_API_URL, forwardJson } from '../_lib';

export async function GET(request: Request) {
  const auth = request.headers.get('authorization') || '';
  const url = new URL(`${BACKEND_API_URL}/sports`);
  // forward query params
  const incoming = new URL(request.url);
  incoming.searchParams.forEach((v, k) => url.searchParams.append(k, v));

  return forwardJson(url.toString(), { method: 'GET', headers: { Authorization: auth } });
}
