import { format } from 'date-fns';
import { redirect } from 'next/navigation';
import prismadb from '@/lib/prismadb';
import { WithParams } from '@/lib/types';
import { auth } from '@clerk/nextjs/server';
import { CategoryClient } from './_components/category-client';
import { CategoryColumn } from './_components/columns';

export default async function CategoriesPage({ params }: Readonly<WithParams>) {
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

  const categories = await prismadb.category.findMany({
    where: {
      storeId
    },
    include: {
      billboard: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedCategories: CategoryColumn[] = categories.map((category) => ({
    id: category.id,
    name: category.name,
    billboardName: category.billboard.name,
    createdAt: format(category.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <>
      {/* <h1>Categories Page</h1> */}
      {/* <p>{store?.name}</p> */}
      {/* <p>{store?.userId}</p> */}
      <CategoryClient categories={formattedCategories} />
    </>
  )
}
