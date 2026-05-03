export { default } from 'next-auth/middleware'

export const config = {
  matcher: ['/dashboard/:path*', '/transactions/:path*', '/goals/:path*', '/import/:path*'],
}
