import { redirect } from 'next/navigation';
import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs/server';

export default async function Layout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ storeId: string; }>;
}>) {
  const { storeId } = await params;
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const store = await prismadb.store.findUnique({
    where: {
      id: storeId,
      userId,
    },
  });

  if (!store) {
    redirect('/');
  }

  return (
    <div>
      <div>This will be a Navbar</div>
      <h1>Store: {store.name}</h1>
      <h2>Store ID: {store.id}</h2>
      <h2>User ID: {userId}</h2>
      {children}
    </div>
  );
}
