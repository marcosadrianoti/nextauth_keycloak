import NextAuth from "next-auth/next";
import { NextAuthOptions, Profile, User } from "next-auth";
import KeycloakProvider, { type KeycloakProfile } from "next-auth/providers/keycloak"
import { type JWT } from "next-auth/jwt";
import { OAuthConfig } from "next-auth/providers/oauth";

interface CustomProfile extends Profile {
  realm_access?: {
    roles: string[];
  };
}

interface CustomUser extends User {
  name: string;
  email: string;
  role: string;
  sub: string;
  teste: string;
}

const keycloak = KeycloakProvider({
  clientId: `${process.env.CLIENT_ID}`,
  clientSecret: `${process.env.CLIENT_SECRET}`,
  issuer: `${process.env.AUTH_ISSUER}`,
});

export const authOptions: NextAuthOptions = {
  providers: [ keycloak ],
  callbacks: {
    jwt: async ({ token, user, account, profile }) => {
      if (user && account) {
        const customProfile: CustomProfile = { ...profile };
        const role = customProfile.realm_access?.roles.includes('admin') ? 'admin' : 'user';
        token = {
          ...token,
          id_token: account.id_token,
          provider: account.provider,
          access_token: account.access_token,
          expires_at: account.expires_at,
          refresh_token: account.refresh_token,
          role: role,
        }
        return token;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session = {
        ...session,
        user:<CustomUser>{
          ...session.user,
          role: token.role,
          sub: token.sub,
          teste: "teste"
        }
      }
      return session;
    }
  },
  events: {
    async signOut({ token }: { token: JWT }) {
      const issuerUrl = (authOptions.providers.find(provider => provider.id === "keycloak") as OAuthConfig<KeycloakProfile>).options!.issuer!
      const logOutUrl = new URL(`${issuerUrl}/protocol/openid-connect/logout`)
      logOutUrl.searchParams.set("id_token_hint", token.id_token!)
      // http://localhost:8080/realms/my-realm/protocol/openid-connect/logout?id_token_hint=your-id_token_hint

      await fetch(logOutUrl);
    },
  },
  // pages: {
  //   signIn: '/login', // É redirecionado corretamente, mas o nextauth não envia os dados para o keycloak
  // }
}

const handlerNextAuth = NextAuth(authOptions);

export { handlerNextAuth as GET, handlerNextAuth as POST }
