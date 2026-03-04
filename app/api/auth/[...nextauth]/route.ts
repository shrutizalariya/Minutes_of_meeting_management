// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";

// const handler = NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//   ],
// });

// export { handler as GET, handler as POST };

// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { signJwt } from "@/lib/jwt"; // your JWT helper

// export const authOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         // your DB check here
//         const user = { id: "1", name: "John Doe", email: credentials?.email };
//         if (user) return user;
//         return null;
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.myToken = signJwt(user.email); // create JWT here
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.jwt = token.myToken; // safe now
//       }
//       return session;
//     },
//   },
//   session: {
//     strategy: "jwt",
//   },
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };
