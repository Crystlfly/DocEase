import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // Add FacebookProvider and TwitterProvider similarly if you want
  ],
  secret: process.env.NEXTAUTH_SECRET,
  // any other NextAuth config options here
});
