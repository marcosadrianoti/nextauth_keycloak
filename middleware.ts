import { NextAuthMiddlewareOptions, NextRequestWithAuth, withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server";

const middleware = (request: NextRequestWithAuth) => { // Aqui fazemos a lógica de autorização para as rotas privadas
  // console.log('request_token', request.nextauth?.token);

  const isPrivateRoutes = request.nextUrl.pathname.startsWith('/private');
  const isAdminUser = request.nextauth.token?.role === 'admin';
  if (isPrivateRoutes && !isAdminUser) {
      return NextResponse.rewrite(new URL('/denied', request.url))
    }
  }
  


const callbackOptions: NextAuthMiddlewareOptions = { }

export default withAuth(middleware, callbackOptions) // uma função e um objeto

export const config = {
  matcher: ['/private'] // rota privada
}