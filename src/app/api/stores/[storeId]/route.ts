import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs/server';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> },
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { name } = body;

    const { storeId } = await params;

    console.log('api/stores/[storeId]/route.ts > userId', userId);
    console.log('api/stores/[storeId]/route.ts > name', name);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Bad Request, name is required", { status: 400 });
    }

    if (!storeId) {
      return new NextResponse("Bad Request, storeId is required", { status: 400 });
    }

    const store = await prismadb.store.update({
      where: {
        id: storeId,
        userId: userId,
      },
      data: { name },
    });

    console.log('api/stores/[storeId]/route.ts > store', store);
    return NextResponse.json(store);

  } catch (error) {
    console.error('api/stores/[storeId]/route.ts', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ storeId: string }> },
) {
  try {
    const { userId } = await auth();
    const { storeId } = await params;

    console.log('api/stores/[storeId]/route.ts > userId', userId);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!storeId) {
      return new NextResponse("Bad Request, storeId is required", { status: 400 });
    }

    const store = await prismadb.store.delete({
      where: {
        id: storeId,
        userId: userId,
      }
    });

    console.log('api/stores/[storeId]/route.ts > store', store);
    return NextResponse.json(store);

  } catch (error) {
    console.error('api/stores/[storeId]/route.ts', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
