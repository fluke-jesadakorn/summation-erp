import { getServerSession, type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import AzureADProvider from "next-auth/providers/azure-ad";

const userService = {
  authenticate,
};

function authenticate(username: string, password: string) {
  if (username !== "admin" && password !== "admin") {
    //(1)
    return null; //(2)
  }

  const user = {
    id: "9001",
    name: "Web Admin",
    email: "admin@example.com",
  }; //(3)

  return user; //(4)
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      console.log("------------ JWT ------------");
      console.log({ token }, { account }, { profile });
      if (account && account.type === "credentials") {
        token.userId = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token, user }) {
      console.log("------------ SESSION ------------");
      console.log({ session }, { token }, { user });
      session.user.id = token.userId;
      return session;
    },
  },

  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID ?? "",
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET ?? "",
      tenantId: process.env.AZURE_AD_TENANT_ID,
    }),
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions); //(6)
