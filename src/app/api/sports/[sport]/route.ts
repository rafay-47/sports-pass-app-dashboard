import { NextRequest } from 'next/server';
import { BACKEND_API_URL, forwardJson } from '../../_lib';

type SportContext = { params: { sport: string } | Promise<{ sport: string }> };

export async function GET(request: NextRequest, context: SportContext) {
  const params = await context.params;
  const sport = params?.sport;
  const url = `${BACKEND_API_URL}/sports/${encodeURIComponent(sport)}`;
  return forwardJson(url, { method: 'GET' });
}

