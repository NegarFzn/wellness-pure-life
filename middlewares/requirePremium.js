import { getServerSession } from "next-auth";
import { authOptions } from "../pages/api/auth/[...nextauth]";

export async function requirePremium(ctx) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (!session?.user?.isPremium) {
    return {
      redirect: {
        destination: "/premium",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}
