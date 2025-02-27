import { env } from '$amplify/env/createCheckoutSession';
import Stripe from 'stripe';

import { Schema } from "../../data/resource";

export const handler: Schema["createCheckoutSession"]["functionHandler"]  = async (event) => {

  const { origin } = event.arguments

  const stripe = new Stripe(env.STRIPE_API_KEY);

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: 'price_1Qr0CvKXcuXgnQQoiJbMMb7V',
        quantity: 1,
      },
    ],
    allow_promotion_codes: true,
    payment_method_types: ['card'],
    mode: 'payment',
    ui_mode: 'embedded',
    return_url: `${origin}/purchase?session_id={CHECKOUT_SESSION_ID}`,
    redirect_on_completion: 'if_required',
    // return_url: 'https://example.com/checkout/return?session_id={CHECKOUT_SESSION_ID}',
    // success_url: `https://thegrowingguide.com/purchased?success=true`,
    // cancel_url: `https://thegrowingguide.com/purchased?canceled=true`,
    // cancel_url: `${YOUR_DOMAIN}?canceled=true`,
    automatic_tax: {enabled: true},
  });


  return JSON.stringify({clientSecret: session.client_secret, sessionId: session.id, email: session.customer_email});
};
