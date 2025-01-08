import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs/server';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ storeId: string; productId: string; }> },
) {
  try {
    const { userId } = await auth();
    const { name, images, price, categoryId, colorId, sizeId, isFeatured, isArchived } = await req.json();
    const { storeId, productId } = await params;

    if (!userId) {
      return new NextResponse("Unauthenticated.", { status: 401 });
    }

    if (!storeId) {
      return new NextResponse("Bad Request, storeId is required", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Bad Request, name is required", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Bad Request, at least one image is required", { status: 400 });
    }

    if (!price || !categoryId || !colorId || !sizeId) {
      return new NextResponse("Bad Request, missing required field", { status: 400 });
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

    await prismadb.product.update({
      where: { id: productId },
      data: {
        name,
        storeId,
        price,
        categoryId,
        colorId,
        sizeId,
        isFeatured,
        isArchived,
        images: {
          deleteMany: {}
        }
      },
    });

    const product = await prismadb.product.update({
      where: { id: productId },
      data: {
        images: {
          createMany: {
            data: images.map((image: { url: string }) => image),
          },
        }
      }
    });
    return NextResponse.json(product);

  } catch (error) {
    console.error('api/[storeId]/products/[productId]/route.ts', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    const { productId } = await params;

    if (!productId) {
      return new NextResponse("Bad Request, productId is required", { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: { id: productId },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
    });

    return NextResponse.json(product);

  } catch (error) {
    console.error('api/[storeId]/products/[productId]/route.ts', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ storeId: string; productId: string; }> },
) {
  try {
    const { userId } = await auth();
    const { storeId, productId } = await params;

    if (!userId) {
      return new NextResponse("Unauthenticated.", { status: 401 });
    }

    if (!storeId) {
      return new NextResponse("Bad Request, storeId is required", { status: 400 });
    }

    if (!productId) {
      return new NextResponse("Bad Request, productId is required", { status: 400 });
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

    const product = await prismadb.product.delete({
      where: { id: productId },
    });

    return NextResponse.json(product);

  } catch (error) {
    console.error('api/[storeId]/products/[productId]/route.ts', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
