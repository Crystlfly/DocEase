import NextAuth from "next-auth";
import * as GoogleProviderImport from "next-auth/providers/google";
const GoogleProvider = GoogleProviderImport.default;

import * as db from "@/db";
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      const roleFromQuery = new URL(account?.callbackUrl || "").searchParams.get("role") || "patient";
      const existingUser = await db.getUserByEmail(user.email) ;

      if (!existingUser) {
        // If not in DB, create a new user
        const uData={
          name: user.name,
          email: user.email,
          role: roleFromQuery
        };
        await db.createUser(uData);
        console.log("🆕 New Google user added:", user.email);
      } else {
        console.log("🔁 Returning Google user:", user.email);
      }

      return true;
    },
    async session({ session, token }) {
      // Attach MongoDB _id if needed later
      const dbUser = await db.getUserByEmail(session.user.email);
      if (dbUser) {
        session.user._id = dbUser._id;
        session.user.role = dbUser.role;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
