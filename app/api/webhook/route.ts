import { db } from "@/core/lib/db";
import { userSubscriptions } from "@/core/lib/db/schema";
import { stripe } from "@/core/lib/stripe";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const WEBHOOK_SECRET = process.env.STRIPE_HOOK_SIGNIN_SECRET as string;

export const POST = async (req: Request) => {
  const body = await req.text();
  const signature = (await headers()).get("Stripe_Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
  } catch (error) {
    return (
      NextResponse.json({ status: "Failed", error: "Server Error" }),
      { status: 500 }
    );
  }

  const session = event.data.object as Stripe.Checkout.Session;

  //   NEW subscription

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string,
    );

    console.log(subscription, "🧥👔👕");

    if (!session?.metadata?.userId)
      return NextResponse.json(
        { status: "Failed", error: "session userId not found" },
        { status: 404 },
      );

    if (!subscription?.metadata.userId) {
      return NextResponse.json(
        {
          status: "Failed",
          error: "subscription wen't wrong",
        },
        { status: 400 },
      );
    }

    await db.insert(userSubscriptions).values({
      userId: session.metadata.userId,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
    });
  }

  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string,
    );
    await db
      .update(userSubscriptions)
      .set({
        stripePriceId: subscription.items.data[0].id,
        stripeCurrentPeriodEnd: new Date(
          subscription.stripeCurrentPeriodEnd * 1000,
        ),
      })
      .where(eq(userSubscriptions.stripeSubscriptionId, subscription.id));
  }

  return NextResponse.json(
    { status: "Success", message: "succeed" },
    { status: 200 },
  );
};
