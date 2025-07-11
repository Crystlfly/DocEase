// pages/api/auth/[...nextauth].js
import * as db from "@/db";

// Dynamically import GoogleProvider and NextAuth
const { default: GoogleProviderRaw } = await import("next-auth/providers/google");
const { default: NextAuthImport } = await import("next-auth");



const GoogleProvider = typeof GoogleProviderRaw === "function"
  ? GoogleProviderRaw
  : GoogleProviderRaw.default;

const NextAuth =
  typeof NextAuthImport.default === "function"
    ? NextAuthImport.default
    : NextAuthImport.default.default;
    
const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      // let role = "patient"; // default

      try {
        // const state = account?.state;
        // const url = new URL(account?.callbackUrl );
        // const role = url.searchParams.get("role") ;
        // console.log("URL",url);
        // console.log("🔍 Role from callback URL:", role);
        const existingUser = await db.getUserByEmail(user.email);

      if (!existingUser) {
        const newUser = await db.createUser({
          name: user.name,
          email: user.email,
        });

        const defaultRole = await db.ensureUserHasRole(newUser._id, "patient");
        
        console.log("🆕 New Google user added:", user.email);
      } else {
        console.log("🔁 Returning Google user:", user.email);
      }


      return true;
        
      } catch (err) {
        console.error("❌ Error in signIn callback:", err);
          return false;
      }

      
    },

    async session({ session }) {
      try{
        const dbUser = await db.getUserByEmail(session.user.email);
        if (dbUser) {
          session.user._id = dbUser._id;
          const roles = await db.getUserRolesByUserId(dbUser._id);
          session.user.roles = roles;
        }
        return session;
      }catch (err){
        console.error("❌ session callback error:", err);
        return session;
      }
    },
  },
};

// Export the handler properly
export default function handler(req, res) {
  return NextAuth(req, res, authOptions);
}
