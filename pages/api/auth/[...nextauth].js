import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { firestore } from "../../../utils/firebaseAdmin"; // ✅ Corrected: use Admin SDK

export default NextAuth({
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

        if (!email || !password) return null;

        try {
          const userQuery = firestore
            .collection("users")
            .where("email", "==", email);
          const snapshot = await userQuery.get();

          if (snapshot.empty) return null;

          const userDoc = snapshot.docs[0];
          const user = userDoc.data();

          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) return null;

          return {
            id: userDoc.id,
            email: user.email,
            name: user.name,
            isPremium: user.isPremium || false,
          };
        } catch (err) {
          console.error("❌ Firebase Admin Auth error:", err.message);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // ⏱️ 24 hours in seconds
  },
  jwt: {
    maxAge: 24 * 60 * 60, // ⏱️ 24 hours in seconds
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.isPremium = user.isPremium;
      }
      return token;
    },
    async session({ session, token }) {
      session.id = token.id;
      session.email = token.email;
      session.name = token.name;
      session.isPremium = token.isPremium;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
