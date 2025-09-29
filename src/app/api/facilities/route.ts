import { BACKEND_API_URL, forwardJson } from '../_lib';

export async function GET(request: Request) {
  const auth = request.headers.get('authorization') || '';
  const url = `${BACKEND_API_URL}/facilities`;
  return forwardJson(url, { method: 'GET', headers: { Authorization: auth } });
}
