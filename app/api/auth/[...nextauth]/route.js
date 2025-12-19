import axios from "axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { email } from "zod";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        try {
          const res = await axios.post(
            "https://focusbackend.vercel.app/api/v1/users/login",
            {
              email: credentials?.email,
              password: credentials?.password,
            },
            {
              withCredentials: true, // 🔥 IMPORTANT
            }
          );

          const data = res.data;

          if (!data?.user) return null;

          return {
            id: data.user._id, // 🔥 REQUIRED
            email: data.user.email,
            name: data.user.name,
          };
        } catch (err) {
          console.error("Auth error:", err.response?.data || err.message);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
