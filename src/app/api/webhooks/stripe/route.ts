import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { db } from '@/db';
import { credits } from '@/db/schema';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2025-02-24.acacia' });

export async function POST(req: Request) {
  const headerPayload = await headers();
  const signature = headerPayload.get('stripe-signature');

  if (!signature) {
    return NextResponse.json('Missing stripe signature', { status: 400 });
  }

  // Get the webhook secret from environment variables
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json('Stripe webhook secret is not configured', { status: 500 });
  }

  try {
    // Get the raw body for signature verification
    const rawBody = await req.text();

    // Verify the webhook signature and construct the event
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret
    );

    // Handle the payment_intent.succeeded event
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const userId = paymentIntent.metadata.userId;
      const amount = paymentIntent.metadata.amount;

      if (!userId || !amount) {
        console.error('Missing userId or amount in payment intent metadata');
        return NextResponse.json('Missing required metadata', { status: 400 });
      }

      try {
        // Add credits to the user's account
        const newCredit = await db.insert(credits).values({
          amount: amount,
          userId: userId,
          type: 'credit',
        })
          .returning();

        return NextResponse.json(newCredit, { status: 200 });
      } catch (error) {
        return NextResponse.json('Error processing payment', { status: 500 });
      }
    }

    // Return a 200 response for any other event types
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error, status: 400 });
  }
}
