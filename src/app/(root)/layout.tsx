import { redirect } from 'next/navigation';
import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs/server';

export default async function SetupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();
  // console.log('SetupLayout > userId', userId);

  if (!userId) {
    redirect('/sign-in');
  }

  const store = await prismadb.store.findFirst({
    where: { userId },
  });

  if (store) {
    redirect(`/${store.id}`);
  }

  return (
    <div>
      {children}
    </div>
  );
}
