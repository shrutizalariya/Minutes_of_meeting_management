import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      jwt?: string; // <-- our custom JWT
    };
  }

  interface JWT {
    myToken?: string; // <-- used internally in token callback
  }
}
