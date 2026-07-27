import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect /admin route and admin API endpoints (POST/PUT/DELETE)
  const isAdminPage = path.startsWith('/admin');
  const isAdminApi = (path.startsWith('/api/products') || path.startsWith('/api/categories') || path.startsWith('/api/categorize-run')) && request.method !== 'GET';

  const authCookie = request.cookies.get('admin_auth')?.value;
  const isAuthenticated = authCookie === 'authenticated';

  if ((isAdminPage || isAdminApi) && !isAuthenticated) {
    if (isAdminApi) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
