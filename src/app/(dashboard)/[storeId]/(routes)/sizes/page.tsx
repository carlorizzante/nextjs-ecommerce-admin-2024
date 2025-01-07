import { format } from 'date-fns';
import { redirect } from 'next/navigation';
import prismadb from '@/lib/prismadb';
import { WithParams } from '@/lib/types';
import { auth } from '@clerk/nextjs/server';
import { SizeColumn } from './_components/columns';
import { SizeClient } from './_components/size-client';

export default async function SizesPage({ params }: Readonly<WithParams>) {
  const { storeId } = await params;
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const store = await prismadb.store.findUnique({
    where: {
      id: storeId,
      userId
    },
  });

  if (!store) {
    redirect('/');
  }

  const sizes = await prismadb.size.findMany({
    where: {
      storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedSizes: SizeColumn[] = sizes.map((size) => ({
    id: size.id,
    name: size.name,
    value: size.value,
    createdAt: format(size.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <>
      {/* <h1>Sizes Page</h1> */}
      {/* <p>{store?.name}</p> */}
      {/* <p>{store?.userId}</p> */}
      <SizeClient sizes={formattedSizes} />
    </>
  )
}
