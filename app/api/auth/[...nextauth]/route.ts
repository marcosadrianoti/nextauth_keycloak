// import NextAuth from "next-auth/next";
// import { Account, NextAuthOptions, Profile, Session } from "next-auth";
// // import CredentialProvider from "next-auth/providers/credentials";
// import KeycloakProvider from "next-auth/providers/keycloak";
// // import { jwtDecode, JwtPayload } from 'jwt-decode';
// import { JWT } from "next-auth/jwt";
// import axios, { AxiosError } from "axios";

// interface CommonJWT extends JWT {
//   provider: string;
//   id_token: string;
//   // outras propriedades comuns, se houver
// }

// interface CustomUser {
//   id: string;
//   name: string;
//   email: string;
//   password: string;
//   role: string;
// }

// interface CustomProfile extends Profile {
//   realm_access?: {
//     roles: string[];
//   };
// }

// const keycloak = KeycloakProvider({
//   clientId: `${process.env.CLIENT_ID}`,
//   clientSecret: `${process.env.CLIENT_SECRET}`,
//   issuer: `${process.env.AUTH_ISSUER}`,
// });

// // async function doFinalSignoutHandshake(jwt: JWT) {
// //   const { provider, id_token } = jwt;

// //   if (provider == keycloak.id) {
// //       try {
// //           // Add the id_token_hint to the query string
// //           const params = new URLSearchParams();
// //           params.append('id_token_hint', id_token);
// //           const { status, statusText } = await axios.get(`${keycloak.options.issuer}/protocol/openid-connect/logout?${params.toString()}`);

// //           // The response body should contain a confirmation that the user has been logged out
// //           console.log("Completed post-logout handshake", status, statusText);
// //       }
// //       catch (e: any) {
// //           console.error("Unable to perform post-logout handshake", (e as AxiosError)?.code || e)
// //       }
// //   }
// // }

// async function doFinalSignoutHandshake(jwt: JWT) {
//   const { provider, id_token } = jwt;

//   if (provider == keycloak.id && keycloak.options) {
//     try {
//       // Add the id_token_hint to the query string
//       const params = new URLSearchParams();
//       params.append('id_token_hint', id_token);
//       const { status, statusText } = await axios.get(`${keycloak.options.issuer}/protocol/openid-connect/logout?${params.toString()}`);

//       // The response body should contain a confirmation that the user has been logged out
//       console.log("Completed post-logout handshake", status, statusText);
//     }
//     catch (e: any) {
//       console.error("Unable to perform post-logout handshake", (e as AxiosError)?.code || e)
//     }
//   }
// }



// export const authOptions: NextAuthOptions = {
//   // providers: [
//   //   CredentialProvider({
//   //     name: "Credentials",
//   //     credentials: {
//   //       email: { label: "Email", type: "email" },
//   //       password: { label: "Password", type: "password" }
//   //     },
//   //     async authorize(credentials) {
//   //       // Aqui é o lugar para verificar se o usuário e a senha são corretos, por exemplo baseado em um banco de dados.
//   //       const user = {
//   //         id: "1",
//   //         name: "John Doe",
//   //         email: "doe@example.com",
//   //         password: "123456",
//   //         role: "admin"
//   //       }

//   //       const isValidEmail = user.email === credentials?.email;
//   //       const isValidPassword = user.password === credentials?.password;
//   //       console.log(isValidEmail, isValidPassword);

//   //       if (!isValidEmail || !isValidPassword) {
//   //         return null;
//   //       }
//   //       return user;
//   //     }
//   //   })
//   // ],
//   providers: [
//     keycloak
//   ],
//   callbacks: {
//     jwt: async ({ token, user, account, profile }) => { // desestrutura o token e o user padrão do NextAuth
//       console.log('user====>', user);
//       // console.log('profile====>', profile);
//       const customProfile: CustomProfile = { ...profile };
//       // console.log('customProfile====>', customProfile);
//       // console.log('token====>', token);

//       // interface DecodedToken extends JwtPayload {
//       //   realm_access?: {
//       //     roles: string[];
//       //   };
//       // }
//       // const myAccessToken = account?.access_token?.toString();
//       // // console.log('myAccessToken====>', myAccessToken);

//       // if (myAccessToken) {
//       //   const decoded: DecodedToken = jwtDecode(myAccessToken as unknown as string);
//       //   console.log('decoded====>', decoded.realm_access?.roles);
//       // }

//       if (user) {
//         const role = customProfile.realm_access?.roles.includes('admin') ? 'admin' : 'user';

//         return {
//           ...token,
//           role: role // acrescenta a propriedade role. Lado do servidor.
//         }
//       }

//       if (account) {
//         // token.decoded = myAccessToken;
//         token.access_token = account.access_token;
//         token.id_token = account.id_token;
//         token.expires_at = account.expires_at;
//         token.refresh_token = account.refresh_token;
//         token.provider = account.provider; // Acrescenta o provedor do token
//         return token;
//       }

//       // const customUser = user as CustomUser;
//       // console.log('customProfile.realm_access?.roles====>', customProfile.realm_access?.roles);
//       // console.log('customProfile====>', customProfile);

//       return token // Retorna o token no lado do servidor
//     },

//     session: async ({ session, token }) => {
//       // console.log('session.user====>', session);
//       return {
//         ...session,
//         user: {
//           ...session.user, // pega as propriedades padrão do user do lado do servidor
//           role: token.role, // pode escolher as propriedades que deseja de dentro do token
//           teste: "teste" // Acrescenta uma propriedade qualquer
//         }
//       }
//     }
//   },
//   events: {
//     signOut: ({ session, token }: { session: Session; token: CommonJWT }) => doFinalSignoutHandshake(token)
//   }


//   //   events: {
//   //     signOut: ({ session, token }) => doFinalSignoutHandshake(token)
//   // }
//   // pages: {
//   //   signIn: "/login"
//   // }
// }
// const handlerNextAuth = NextAuth(authOptions);

// export { handlerNextAuth as GET, handlerNextAuth as POST }



import NextAuth from "next-auth/next";
import { Account, NextAuthOptions, Profile, Session } from "next-auth";
// import CredentialProvider from "next-auth/providers/credentials";
// import KeycloakProvider from "next-auth/providers/keycloak";
// import { jwtDecode, JwtPayload } from 'jwt-decode';
// import { JWT } from "next-auth/jwt";
import axios, { AxiosError } from "axios";
import KeycloakProvider, { type KeycloakProfile } from "next-auth/providers/keycloak"
import { type JWT } from "next-auth/jwt";
// import { type OAuthConfig } from "next-auth/providers";
import { OAuthConfig } from "next-auth/providers/oauth";

let id_token_hint = ''

declare module 'next-auth/jwt' {
  interface JWT {
    id_token?: string;
    provider?: string;
  }
}

interface CommonJWT extends JWT {
  provider: string;
  id_token: string;
}

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

const keycloak = KeycloakProvider({
  clientId: `${process.env.CLIENT_ID}`,
  clientSecret: `${process.env.CLIENT_SECRET}`,
  issuer: `${process.env.AUTH_ISSUER}`,
});

// async function doFinalSignoutHandshake(jwt: JWT) {
//   const { provider, id_token } = jwt;
//   console.log('jwt====>', jwt);

//   if (provider === keycloak.id && keycloak.options) {
//     try {
//       // Add the id_token_hint to the query string
//       const params = new URLSearchParams();
//       params.append('id_token_hint', id_token || "");
//       const { status, statusText } = await axios.get(`${keycloak.options.issuer}/protocol/openid-connect/logout?${params.toString()}`);

//       // The response body should contain a confirmation that the user has been logged out
//       console.log("Completed post-logout handshake", status, statusText);
//     }
//     catch (e: any) {
//       console.error("Unable to perform post-logout handshake", (e as AxiosError)?.code || e)
//     }
//   }
// }



export const authOptions: NextAuthOptions = {
  providers: [
    keycloak
  ],
  callbacks: {
    jwt: async ({ token, user, account, profile }) => {
      // console.log('user====>', user);
      // console.log('account.id_token====>', account?.id_token, 'user====>>>', user);
      // if (account) {
      //   id_token_hint = account.id_token || '';
      //   console.log('entrou');
      // }
      // console.log('saiu', id_token_hint);

      const customProfile: CustomProfile = { ...profile };

      if (user && account) {
        const role = customProfile.realm_access?.roles.includes('admin') ? 'admin' : 'user';
        token = {
          ...token,
          id_token: account.id_token,
          provider: account.provider,
          access_token: account.access_token,
          expires_at: account.expires_at,
          refresh_token: account.refresh_token,
          role: role
        }

        return token;
      }
      // if (user) {
      //   const role = customProfile.realm_access?.roles.includes('admin') ? 'admin' : 'user';

      //   return {
      //     ...token,
      //     role: role
      //   }
      // }

      // if (account) {
      //   token.access_token = account.access_token;
      //   // token.id_token = account.id_token;
      //   token.expires_at = account.expires_at;
      //   token.refresh_token = account.refresh_token;
      //   token.provider = account.provider;
      //   return token;
      // }
      // if (account) {
      //   console.log('account para token====>', account);
        
      //   return {
      //     ...token,
      //     id_token: account.id_token,
      //     provider: account.provider,
      //     access_token: account.access_token,
      //     expires_at: account.expires_at,
      //     refresh_token: account.refresh_token,
      //   }
      // }

      return token;
    },
    session: async ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          role: token.role,
          teste: "teste"
        }
      }
    }
  },
  events: {
    async signOut({ token }: { token: JWT }) {
    // async signOut({ session, token }: { session: Session; token: JWT }) {
      console.log('token.id_token====>>>>>>>>>>>>', token.id_token);
      // console.log('session====>', session);
      // if (token.provider === "keycloak") {
      const issuerUrl = (authOptions.providers.find(p => p.id === "keycloak") as OAuthConfig<KeycloakProfile>).options!.issuer!
      // console.log('issuerUrl====>', issuerUrl);

      const logOutUrl = new URL(`${issuerUrl}/protocol/openid-connect/logout`)
      // console.log('id_token_hint====>', id_token_hint);

      logOutUrl.searchParams.set("id_token_hint", token.id_token!) //token.id_token!)
      // console.log('logOutUrl====>', logOutUrl);
      // http://{domain-name}/auth/realms/{realm-name}/protocol/openid-connect/logout
      // http://localhost:8080/realms/my-realm/protocol/openid-connect/logout

      await fetch(logOutUrl);
      // }
    },
  }
  // events: {
  //   signOut: ({ session, token }: { session: Session; token: JWT }) => doFinalSignoutHandshake(token)
  // }
}

const handlerNextAuth = NextAuth(authOptions);

export { handlerNextAuth as GET, handlerNextAuth as POST }
