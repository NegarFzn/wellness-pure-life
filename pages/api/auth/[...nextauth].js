import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { firestore } from "../../../utils/firebaseAdmin"; // ✅ Admin SDK

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
            isVerified: user.isVerified || false, // ✅ Include verification status
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
    maxAge: 24 * 60 * 60,
  },
  jwt: {
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.isPremium = user.isPremium;
        token.emailVerified = user.isVerified || false; // ✅ Set from Firestore
      }
      return token;
    },
    async session({ session, token }) {
      session.id = token.id;
      session.email = token.email;
      session.name = token.name;
      session.isPremium = token.isPremium;
      session.user.emailVerified = token.emailVerified || false; // ✅ Pass to session.user
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
