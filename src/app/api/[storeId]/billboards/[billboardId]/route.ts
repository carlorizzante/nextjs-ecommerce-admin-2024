import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs/server';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ storeId: string; billboardId: string; }> },
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { name, imageUrl } = body;

    const { storeId, billboardId } = await params;

    if (!userId) {
      return new NextResponse("Unauthenticated.", { status: 401 });
    }

    if (!storeId) {
      return new NextResponse("Bad Request, storeId is required", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Bad Request, name is required", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("Bad Request, imageUrl is required", { status: 400 });
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

    const billboard = await prismadb.billboard.update({
      where: { id: billboardId },
      data: {
        name,
        imageUrl,
      }
    });

    return NextResponse.json(billboard);

  } catch (error) {
    console.error('api/[storeId]/billboards/[billboardId]/route.ts', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ billboardId: string }> },
) {
  try {
    const { billboardId } = await params;

    const billboard = await prismadb.billboard.findUnique({
      where: { id: billboardId },
    });

    return NextResponse.json(billboard);

  } catch (error) {
    console.error('api/[storeId]/billboards/[billboardId]/route.ts', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ storeId: string; billboardId: string; }> },
) {
  try {
    const { userId } = await auth();
    const { storeId, billboardId } = await params;

    if (!userId) {
      return new NextResponse("Unauthenticated.", { status: 401 });
    }

    if (!storeId) {
      return new NextResponse("Bad Request, storeId is required", { status: 400 });
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

    const billboard = await prismadb.billboard.delete({
      where: { id: billboardId },
    });

    return NextResponse.json(billboard);

  } catch (error) {
    console.error('api/[storeId]/billboards/[billboardId]/route.ts', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
