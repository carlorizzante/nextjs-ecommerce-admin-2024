import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request, res: Response) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { name } = body;

    console.log('api/stores/route.ts > userId', userId);
    console.log('api/stores/route.ts > name', name);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Bad Request, name is required", { status: 400 });
    }

    const store = await prismadb.store.create({
      data: {
        name,
        userId,
      },
    });

    console.log('api/stores/route.ts > store', store);

    return NextResponse.json(store);

  } catch (error) {
    console.error('api/stores/route.ts', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
