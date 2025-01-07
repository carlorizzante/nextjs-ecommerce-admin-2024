import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs/server';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ storeId: string; sizeId: string; }> },
) {
  try {
    const { userId } = await auth();
    const { name, value } = await req.json();
    const { storeId, sizeId } = await params;

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

    const size = await prismadb.size.update({
      where: { id: sizeId },
      data: {
        name,
        value,
      }
    });

    return NextResponse.json(size);

  } catch (error) {
    console.error('api/[storeId]/sizes/[sizeId]/route.ts', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ sizeId: string }> },
) {
  try {
    const { sizeId } = await params;

    if (!sizeId) {
      return new NextResponse("Bad Request, sizeId is required", { status: 400 });
    }

    const size = await prismadb.size.findUnique({
      where: { id: sizeId },
    });

    return NextResponse.json(size);

  } catch (error) {
    console.error('api/[storeId]/sizes/[sizeId]/route.ts', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ storeId: string; sizeId: string; }> },
) {
  try {
    const { userId } = await auth();
    const { storeId, sizeId } = await params;

    if (!userId) {
      return new NextResponse("Unauthenticated.", { status: 401 });
    }

    if (!storeId) {
      return new NextResponse("Bad Request, storeId is required", { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse("Bad Request, sizeId is required", { status: 400 });
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

    const size = await prismadb.size.delete({
      where: { id: sizeId },
    });

    return NextResponse.json(size);

  } catch (error) {
    console.error('api/[storeId]/sizes/[sizeId]/route.ts', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
