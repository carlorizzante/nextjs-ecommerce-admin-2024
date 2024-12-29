import { redirect } from 'next/navigation';
import { StoreSettingsForm } from '@/components/forms/store-settings-form';
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
    <div className="flex-col">
      <div className="flex-1 gap-4 p-4">
        {/* <h1>Settings Page</h1>
        <p>{store?.name}</p>
        <p>{store?.userId}</p> */}
        <StoreSettingsForm store={store} />
      </div>
    </div>
  )
}
