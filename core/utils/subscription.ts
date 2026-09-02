import { auth } from "@clerk/nextjs/server";
import { db } from "../lib/db";
import { userSubscriptions } from "../lib/db/schema";
import { eq } from "drizzle-orm";

const dayInMs = 1000 * 60 * 60 * 24;

export const checkSubscription = async (): Promise<boolean> => {
  const { userId } = await auth();

  if (!userId) {
    return false;
  }

  const _userSubscription = await db
    .select()
    .from(userSubscriptions)
    .where(eq(userSubscriptions.userId, userId));

  if (!_userSubscription[0]) return false;

  const userSubscription = _userSubscription[0];
  const isValid =
    userSubscription.stripePriceId &&
    userSubscription.stripeCurrentPeriodEnd!.getTime() + dayInMs > Date.now();

  return !!isValid;
};
