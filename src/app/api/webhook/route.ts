import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prismadb from '@/lib/prismadb';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const HEADERS = await headers();
  const signature = HEADERS.get("Stripe-Signature") as string;
  // const signature = headers.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

  } catch (error) {
    return new NextResponse("Webhook Error", { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const address = session.customer_details?.address;

  const address_components = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country,
  ];

  const addressString = address_components.filter(Boolean).join(", ");

  if (event.type === "checkout.session.completed") {
    console.log("Checkout session completed", session.id);
    console.log("Shipping address", addressString);
    const oeder = await prismadb.order.update({
      where: { id: session?.metadata?.orderId },
      data: {
        isPaid: true,
        address: addressString,
        phone: session?.customer_details?.phone || "",
      },
      include: { orderItems: true },
    });

    const productIds = oeder.orderItems.map((orderItem) => orderItem.productId);

    await prismadb.product.updateMany({
      where: {
        id: {
          in: productIds,
        }
      },
      data: {
        isArchived: true,
      },
    })
  }

  return new NextResponse(null, { status: 200 });
}
