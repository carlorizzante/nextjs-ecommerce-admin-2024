import {
  NextRequest,
  NextResponse,
} from 'next/server';
import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs/server';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> },
) {
  try {
    const { userId } = await auth();
    const { name, images, price, categoryId, colorId, sizeId, isFeatured, isArchived } = await req.json();
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

    console.log('api/[storeId]/products/route.ts', images);

    const product = await prismadb.product.create({
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
          createMany: {
            data: images.map((image: { url: string }) => image),
          },
        }
      },
    });

    return NextResponse.json(product);

  } catch (error) {
    console.error('api/[storeId]/products/route.ts', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ storeId: string }> },
) {
  try {
    const { storeId } = await params;
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId') || undefined;
    const colorId = searchParams.get('colorId') || undefined;
    const sizeId = searchParams.get('sizeId') || undefined;
    const isFeatured = searchParams.get('isFeatured');

    if (!storeId) {
      return new NextResponse("Bad Request, storeId is required", { status: 400 });
    }

    console.log('params', { storeId, categoryId, colorId, sizeId, isFeatured });
    console.log('searchParams', searchParams.has('categoryId'), searchParams.has('colorId'), searchParams.has('sizeId'), searchParams.has('isFeatured'));

    const products = await prismadb.product.findMany({
      where: {
        storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: !!isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    return NextResponse.json(products);

  } catch (error) {
    console.error('api/[storeId]/billboards/route.ts', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
