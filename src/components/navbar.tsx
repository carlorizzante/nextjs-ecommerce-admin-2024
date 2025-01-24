import { redirect } from 'next/navigation';
import { MainNavigation } from '@/components/main-navigation';
import { StoreSwitcher } from '@/components/store-switcher';
import prismadb from '@/lib/prismadb';
import { UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { ThemeToggle } from './theme-toggle';

export const Navbar = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const stores = await prismadb.store.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="flex h-16 items-center gap-8 px-4 border-b">
      <StoreSwitcher items={stores} />
      <MainNavigation className="flex-1" />
      <ThemeToggle />
      <div className="flex items-centerr ml-auto space-x-4">
        <UserButton />
      </div>
    </div>
  )
}
