import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs/server';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ storeId: string; colorId: string; }> },
) {
  try {
    const { userId } = await auth();
    const { name, value } = await req.json();
    const { storeId, colorId } = await params;

    if (!userId) {
      return new NextResponse("Unauthenticated.", { status: 401 });
    }

    if (!storeId) {
      return new NextResponse("Bad Request, storeId is required", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Bad Request, name is required", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Bad Request, value is required", { status: 400 });
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

    const color = await prismadb.color.update({
      where: { id: colorId },
      data: {
        name,
        value,
      }
    });

    return NextResponse.json(color);

  } catch (error) {
    console.error('api/[storeId]/colors/[colorId]/route.ts', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ colorId: string }> },
) {
  try {
    const { colorId } = await params;

    if (!colorId) {
      return new NextResponse("Bad Request, colorId is required", { status: 400 });
    }

    const color = await prismadb.color.findUnique({
      where: { id: colorId },
    });

    return NextResponse.json(color);

  } catch (error) {
    console.error('api/[storeId]/colors/[colorId]/route.ts', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ storeId: string; colorId: string; }> },
) {
  try {
    const { userId } = await auth();
    const { storeId, colorId } = await params;

    if (!userId) {
      return new NextResponse("Unauthenticated.", { status: 401 });
    }

    if (!storeId) {
      return new NextResponse("Bad Request, storeId is required", { status: 400 });
    }

    if (!colorId) {
      return new NextResponse("Bad Request, colorId is required", { status: 400 });
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

    const color = await prismadb.color.delete({
      where: { id: colorId },
    });

    return NextResponse.json(color);

  } catch (error) {
    console.error('api/[storeId]/colors/[colorId]/route.ts', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
