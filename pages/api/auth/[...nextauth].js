import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { firestore } from "../../../utils/firebaseAdmin"; // Admin SDK

// 🔥 FIX: Normalize Firestore values (string → boolean)
function normalizeIsPremium(value) {
  if (value === true) return true;
  if (value === "true") return true;
  if (value === 1) return true;
  return false;
}

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

        if (!email) return null;

        try {
          const userQuery = firestore
            .collection("users")
            .where("email", "==", email);

          const snapshot = await userQuery.get();
          if (snapshot.empty) return null;

          const userDoc = snapshot.docs[0];
          const user = userDoc.data();

          // Validate password
          if (password) {
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) return null;
          }

          return {
            id: userDoc.id,
            email: user.email,
            name: user.name || null,
            isPremium: normalizeIsPremium(user.isPremium), // 🔥 FIXED
          };
        } catch (err) {
          console.error("❌ Firebase Admin Auth error:", err);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day
  },

  jwt: {
    maxAge: 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // On login
      if (user) {
        token.id = user.id;
        token.uid = user.id;
        token.email = user.email;
        token.name = user.name;
        token.isPremium = normalizeIsPremium(user.isPremium); // 🔥 FIXED
      }

      // Refresh token from Firestore
      if (token.id) {
        try {
          const userDoc = await firestore
            .collection("users")
            .doc(token.id)
            .get();

          const userData = userDoc.data();

          token.isPremium = normalizeIsPremium(userData?.isPremium); // 🔥 FIXED
          token.emailVerified = userData?.isVerified || false;
        } catch (err) {
          console.error("❌ Firebase Admin Auth error:", err);
          token.isPremium = false;
          token.emailVerified = false;
        }
      }

      // If session updated manually
      if (trigger === "update" && session?.isPremium !== undefined) {
        token.isPremium = normalizeIsPremium(session.isPremium); // 🔥 FIXED
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.uid = token.uid;
      session.user.email = token.email;
      session.user.name = token.name;

      // 🔥 FIX: Guarantee true boolean always
      session.user.isPremium = normalizeIsPremium(token.isPremium);

      session.user.emailVerified = token.emailVerified;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});
