import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs/server';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> },
) {
  try {
    const { userId } = await auth();
    const { name, billboardId } = await req.json();
    const { storeId } = await params;

    if (!userId) {
      return new NextResponse("Unauthenticated.", { status: 401 });
    }

    if (!storeId) {
      return new NextResponse("Bad Request, storeId is required", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Bad Request, name is required", { status: 400 });
    }

    if (!billboardId) {
      return new NextResponse("Bad Request, billboardId is required", { status: 400 });
    }

    const isStoreOwner = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId: userId,
      },
    });

    if (!isStoreOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const category = await prismadb.category.create({
      data: {
        name,
        billboardId,
        storeId
      },
    });

    return NextResponse.json(category);

  } catch (error) {
    console.error('api/[storeId]/categories/route.ts', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> },
) {
  try {
    const { storeId } = await params;

    if (!storeId) {
      return new NextResponse("Bad Request, storeId is required", { status: 400 });
    }

    const categories = await prismadb.category.findMany({
      where: { storeId },
    });

    return NextResponse.json(categories);

  } catch (error) {
    console.error('api/[storeId]/categories/route.ts', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
