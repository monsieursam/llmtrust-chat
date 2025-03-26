import { NextResponse, type NextRequest } from "next/server";
import Stripe from 'stripe';
import { auth } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2025-02-24.acacia' });

export async function POST(req: NextRequest) {
  try {
    const { amount, total } = await req.json();
    const user = await auth();
    const { userId } = user

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: total * 100,
            product: process.env.PRODUCT_ID,

          },
          quantity: 1,
        },
      ],
      automatic_tax: {
        enabled: true,
      },
      adaptive_pricing: {
        enabled: true,
      },
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
      payment_intent_data: {
        metadata: {
          userId: userId,
          amount: amount,
          type: 'funds_addition'
        },
      }
    });

    return NextResponse.json({ id: session.id }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err },
      { status: 500 }
    );
  }
}
