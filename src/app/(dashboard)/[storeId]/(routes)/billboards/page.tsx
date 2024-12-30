import { redirect } from 'next/navigation';
import { BillboardClient } from '@/components/billboard-client';
import prismadb from '@/lib/prismadb';
import { WithParams } from '@/lib/types';
import { auth } from '@clerk/nextjs/server';

export default async function SettingsPage({ params }: Readonly<WithParams>) {
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

  return (
    <>
      {/* <h1>Billboards Page</h1> */}
      {/* <p>{store?.name}</p> */}
      {/* <p>{store?.userId}</p> */}
      <BillboardClient />
    </>
  )
}
