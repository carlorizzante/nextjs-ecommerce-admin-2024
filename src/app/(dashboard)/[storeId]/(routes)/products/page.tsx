import { format } from 'date-fns';
import { redirect } from 'next/navigation';
import prismadb from '@/lib/prismadb';
import { WithParams } from '@/lib/types';
import { currencyFormatter } from '@/lib/utils';
import { auth } from '@clerk/nextjs/server';
import { ProductColumn } from './_components/columns';
import { ProductClient } from './_components/product-client';

export default async function ProductsPage({ params }: Readonly<WithParams>) {
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

  const products = await prismadb.product.findMany({
    where: {
      storeId
    },
    include: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedProducts: ProductColumn[] = products.map(({
    category,
    color,
    createdAt,
    price,
    size,
    ...rest
  }) => ({
    category: category.name,
    color: color.value,
    size: size.name,
    price: currencyFormatter.format(price.toNumber()),
    createdAt: format(createdAt, 'MMMM do, yyyy'),
    ...rest,
  }));

  return (
    <>
      {/* <h1>Products Page</h1> */}
      {/* <p>{store?.name}</p> */}
      {/* <p>{store?.userId}</p> */}
      <ProductClient products={formattedProducts} />
    </>
  )
}
