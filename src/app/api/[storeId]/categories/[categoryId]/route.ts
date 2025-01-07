import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs/server';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ storeId: string; categoryId: string; }> },
) {
  try {
    const { userId } = await auth();
    const { name, billboardId } = await req.json();
    const { storeId, categoryId } = await params;

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

    const category = await prismadb.category.update({
      where: { id: categoryId },
      data: {
        name,
        billboardId,
      }
    });

    return NextResponse.json(category);

  } catch (error) {
    console.error('api/[storeId]/categories/[categoryId]/route.ts', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ categoryId: string }> },
) {
  try {
    const { categoryId } = await params;

    if (!categoryId) {
      return new NextResponse("Bad Request, categoryId is required", { status: 400 });
    }

    const category = await prismadb.billboard.findUnique({
      where: { id: categoryId },
    });

    return NextResponse.json(category);

  } catch (error) {
    console.error('api/[storeId]/categories/[categoryId]/route.ts', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ storeId: string; categoryId: string; }> },
) {
  try {
    const { userId } = await auth();
    const { storeId, categoryId } = await params;

    if (!userId) {
      return new NextResponse("Unauthenticated.", { status: 401 });
    }

    if (!storeId) {
      return new NextResponse("Bad Request, storeId is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Bad Request, categoryId is required", { status: 400 });
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

    const category = await prismadb.category.delete({
      where: { id: categoryId },
    });

    return NextResponse.json(category);

  } catch (error) {
    console.error('api/[storeId]/categories/[categoryId]/route.ts', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
