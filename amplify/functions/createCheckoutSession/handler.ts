import { env } from '$amplify/env/createCheckoutSession';
import Stripe from 'stripe';

import { Schema } from "../../data/resource";

export const handler: Schema["createCheckoutSession"]["functionHandler"]  = async (event) => {

  const { origin, product, automaticallyApplyWelcome15 } = event.arguments

  const automaticallyApplyWelcome15Parsed: boolean = JSON.parse(automaticallyApplyWelcome15)

  // V2 price indicates a different "product" in stripe, whose description explains the redirect to planner upon transaction complete.
  const price =
    product === "print"
    ? 'price_1RCIzmKXcuXgnQQohShuxB7I'
    : product === "digital"
    ? 'price_1RBnjYKXcuXgnQQoa2eimOk7'
    : product === "print-v2"
    ? "price_1RMaEgKXcuXgnQQo9kEaMdkJ"
    : product === 'digital-v2'
    ? "price_1RMaCeKXcuXgnQQojsCAlqUh"
    : "not found"
  const stripe = new Stripe(env.STRIPE_API_KEY);

  const preSetDiscountOptions: Stripe.Checkout.SessionCreateParams = {
    line_items: [
      {
        price: price,
        quantity: 1,
      },
    ],
    discounts: [
      {
        promotion_code: 'promo_1RE7RHKXcuXgnQQoAeTA6eS4', // Use the promotion_code ID, not the code string
      },
    ],
    payment_method_types: ['card'],
    mode: 'payment',
    ui_mode: 'embedded',
    return_url: `${origin}/purchase?session_id={CHECKOUT_SESSION_ID}`,
    redirect_on_completion: 'if_required',
    automatic_tax: {enabled: true},
  }

  const allowPromoCodeOptions: Stripe.Checkout.SessionCreateParams = {
    line_items: [
      {
        price: price,
        quantity: 1,
      },
    ],
    allow_promotion_codes: true,
    payment_method_types: ['card'],
    mode: 'payment',
    ui_mode: 'embedded',
    return_url: `${origin}/purchase?session_id={CHECKOUT_SESSION_ID}`,
    redirect_on_completion: 'if_required',
    automatic_tax: {enabled: true},
  }

  const session = automaticallyApplyWelcome15Parsed
    ? await stripe.checkout.sessions.create(preSetDiscountOptions)
    : await stripe.checkout.sessions.create(allowPromoCodeOptions)

  return JSON.stringify({clientSecret: session.client_secret, sessionId: session.id, email: session.customer_email});
};
