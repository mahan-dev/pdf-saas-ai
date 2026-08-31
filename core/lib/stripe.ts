import Stripe from "stripe";

const API_KEY = process.env.STRIPE_SECRET_KEY as string;

export const stripe = new Stripe(API_KEY, {
  apiVersion: "2026-08-26.dahlia",
  typescript: true,
});
