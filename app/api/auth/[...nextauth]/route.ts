import NextAuth from "next-auth/next";
import { Account, NextAuthOptions, Profile } from "next-auth";
// import CredentialProvider from "next-auth/providers/credentials";
import KeycloakProvider from "next-auth/providers/keycloak";
// import { jwtDecode, JwtPayload } from 'jwt-decode';

interface CustomUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
}

interface CustomProfile extends Profile {
  realm_access?: {
    roles: string[];
  };
}

export const authOptions: NextAuthOptions = {
  // providers: [
  //   CredentialProvider({
  //     name: "Credentials",
  //     credentials: {
  //       email: { label: "Email", type: "email" },
  //       password: { label: "Password", type: "password" }
  //     },
  //     async authorize(credentials) {
  //       // Aqui é o lugar para verificar se o usuário e a senha são corretos, por exemplo baseado em um banco de dados.
  //       const user = {
  //         id: "1",
  //         name: "John Doe",
  //         email: "doe@example.com",
  //         password: "123456",
  //         role: "admin"
  //       }

  //       const isValidEmail = user.email === credentials?.email;
  //       const isValidPassword = user.password === credentials?.password;
  //       console.log(isValidEmail, isValidPassword);

  //       if (!isValidEmail || !isValidPassword) {
  //         return null;
  //       }
  //       return user;
  //     }
  //   })
  // ],
  providers: [
    KeycloakProvider({
      clientId: `${process.env.CLIENT_ID}`,
      clientSecret: `${process.env.CLIENT_SECRET}`,
      issuer: `${process.env.AUTH_ISSUER}`,
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, account, profile }) => { // desestrutura o token e o user padrão do NextAuth
      console.log('user====>', user);
      // console.log('profile====>', profile);
      const customProfile: CustomProfile = { ...profile };
      // console.log('customProfile====>', customProfile);
      // console.log('token====>', token);

      // interface DecodedToken extends JwtPayload {
      //   realm_access?: {
      //     roles: string[];
      //   };
      // }
      // const myAccessToken = account?.access_token?.toString();
      // // console.log('myAccessToken====>', myAccessToken);

      // if (myAccessToken) {
      //   const decoded: DecodedToken = jwtDecode(myAccessToken as unknown as string);
      //   console.log('decoded====>', decoded.realm_access?.roles);
      // }
      
      if (user) {
        const role = customProfile.realm_access?.roles.includes('admin') ? 'admin' : 'user';
        
        return {
          ...token,
          role: role // acrescenta a propriedade role. Lado do servidor.
        }
      }

      if (account) {
        // token.decoded = myAccessToken;
        token.access_token = account.access_token;
        token.id_token = account.id_token;
        token.expires_at = account.expires_at;
        token.refresh_token = account.refresh_token;
        return token;
      }

      // const customUser = user as CustomUser;
      // console.log('customProfile.realm_access?.roles====>', customProfile.realm_access?.roles);
      // console.log('customProfile====>', customProfile);
      
      return token // Retorna o token no lado do servidor
    },

    session: async ({ session, token }) => {
      // console.log('session.user====>', session);
      return {
        ...session,
        user: {
          ...session.user, // pega as propriedades padrão do user do lado do servidor
          role: token.role, // pode escolher as propriedades que deseja de dentro do token
          teste: "teste" // Acrescenta uma propriedade qualquer
        }
      }
    }
  },
  // pages: {
  //   signIn: "/login"
  // }
}
const handlerNextAuth = NextAuth(authOptions);

export { handlerNextAuth as GET, handlerNextAuth as POST }
