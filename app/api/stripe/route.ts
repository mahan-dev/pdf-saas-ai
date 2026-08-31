import { db } from "@/core/lib/db";
import { userSubscriptions } from "@/core/lib/db/schema";
import { stripe } from "@/core/lib/stripe";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_BASE_URL + "/";

export const GET = async () => {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId)
      return NextResponse.json(
        { status: "Failed", error: "Unauthorized" },
        { status: 401 },
      );

    const _userSubscription = await db
      .select()
      .from(userSubscriptions)
      .where(eq(userSubscriptions.userId, userId));

    if (_userSubscription[0] && _userSubscription[0].userId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: _userSubscription[0].stripeCustomerId,
        return_url: BASE_URL,
      });

      return NextResponse.json({ url: stripeSession.url });
    }

    // First time user trying to subscribe

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: BASE_URL,
      cancel_url: BASE_URL,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: user?.emailAddresses[0].emailAddress,
      line_items: [
        {
          price_data: {
            currency: "USD",
            product_data: {
              name: "Chat PDF Pro",
              description: "Unlimited Access",
            },
            unit_amount: 2000,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
      },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.log("stripe api error occurred", error);
    return NextResponse.json(
      { status: "Failed", error: "Server Error" },
      { status: 500 },
    );
  }
};
