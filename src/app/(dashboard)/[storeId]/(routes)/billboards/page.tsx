import { format } from 'date-fns';
import { redirect } from 'next/navigation';
import prismadb from '@/lib/prismadb';
import { WithParams } from '@/lib/types';
import { auth } from '@clerk/nextjs/server';
import { BillboardClient } from './_components/billboard-client';
import { BillboardColumn } from './_components/columns';

export default async function BillboardsPage({ params }: Readonly<WithParams>) {
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

  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedBillboards: BillboardColumn[] = billboards.map((billboard) => ({
    id: billboard.id,
    name: billboard.name,
    createdAt: format(billboard.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <>
      {/* <h1>Billboards Page</h1> */}
      {/* <p>{store?.name}</p> */}
      {/* <p>{store?.userId}</p> */}
      <BillboardClient billboards={formattedBillboards} />
    </>
  )
}
