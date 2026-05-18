import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  // Extract hostname from headers, stripping port if present
  let hostname = request.headers.get('host') || '';
  hostname = hostname.split(':')[0];

  // 1. Never touch vpn.saranshhalwai.me
  if (hostname === 'vpn.saranshhalwai.me') {
    return NextResponse.next();
  }

  // 2. Allow localhost / development environments
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return NextResponse.next();
  }

  const mainDomain = 'saranshhalwai.me';

  // 3. Redirect everything else to the main domain
  if (hostname !== mainDomain) {
    url.hostname = mainDomain;
    url.port = ''; // Ensure no port is used in standard https
    url.protocol = 'https:';
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
