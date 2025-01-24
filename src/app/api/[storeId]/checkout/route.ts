import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prismadb from '@/lib/prismadb';
import { stripe } from '@/lib/stripe';

;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export async function OPTIONS() {
  // return {
  //   statusCode: 200,
  //   headers: corsHeaders,
  // };
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  const { productIds } = await req.json();
  const { storeId } = await params;

  console.log("productIds", productIds);
  console.log("storeId", storeId);
  console.log(process.env.FRONTEND_STORE_URL);

  if (!productIds || productIds.length === 0) {
    return NextResponse.json({ error: "No products in cart" }, { status: 400 });
  }

  const products = await prismadb.product.findMany({
    where: { id: { in: productIds } }
  });

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  products.forEach((product) => {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
        },
        unit_amount: product.price.toNumber() * 100,
      },
    });
  });

  const order = await prismadb.order.create({
    data: {
      storeId,
      // isPaid: false, // Default value false
      orderItems: {
        create: productIds.map((productId: string) => ({
          product: { connect: { id: productId } }
        }))
      }
    }
  });

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    billing_address_collection: "required",
    phone_number_collection: { enabled: true },
    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
    metadata: {
      orderId: order.id,
    }
  });

  return NextResponse.json({
    id: session.id,
    url: session.url,
  }, {
    headers: corsHeaders,
  });
}
