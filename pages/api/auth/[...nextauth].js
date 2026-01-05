import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "../../../utils/mongodb";

/* ------------------------------------------
   NORMALIZE PREMIUM FLAG
------------------------------------------- */
function normalizeIsPremium(value) {
  return value === true || value === "true" || value === 1;
}

/* ------------------------------------------
   NEXTAUTH CONFIG
------------------------------------------- */
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const email = credentials.email?.trim().toLowerCase();
        const password = credentials.password?.trim();

        // Require both email + password
        if (!email || !password) return null;

        try {
          const { db } = await connectToDatabase();
          const user = await db.collection("users").findOne({ email });

          if (!user) return null;

          // User must have a password in DB
          if (!user.password) return null;

          // Validate password
          const valid = await bcrypt.compare(password, user.password);
          if (!valid) return null;

          // Return into JWT
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name || null,
             isPremium: normalizeIsPremium(user.isPremium), 
            emailVerified: user.isVerified || false,
          };
        } catch (err) {
          console.error("❌ MongoDB Auth Error:", err);
          return null;
        }
      },
    }),
  ],

  /* ------------------------------------------
     SESSION & JWT
  ------------------------------------------- */
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },

  jwt: {
    maxAge: 24 * 60 * 60,
  },

  callbacks: {
    /* ------------------------------------------
       JWT: Add user, refresh premium from Mongo
    ------------------------------------------- */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.emailVerified = user.emailVerified;
      }

      // Refresh premium status from MongoDB every request
      if (token.email) {
        try {
          const { db } = await connectToDatabase();
          const mongoUser = await db.collection("users").findOne({
            email: token.email,
          });

          if (mongoUser) {
            token.isPremium = normalizeIsPremium(mongoUser.isPremium);
          }
        } catch (err) {
          console.error("❌ MongoDB premium lookup error:", err);
        }
      }

      return token;
    },

    /* ------------------------------------------
       SESSION: Expose token to client
    ------------------------------------------- */
    async session({ session, token }) {
      if (!session.user) session.user = {};

      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.isPremium = normalizeIsPremium(token.isPremium);
      session.user.emailVerified = token.emailVerified ?? false;

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
