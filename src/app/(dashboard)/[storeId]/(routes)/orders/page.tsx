import { format } from 'date-fns';
import { redirect } from 'next/navigation';
import prismadb from '@/lib/prismadb';
import { WithParams } from '@/lib/types';
import { currencyFormatter } from '@/lib/utils';
import { auth } from '@clerk/nextjs/server';
import { OrderColumn } from './_components/columns';
import { OrderClient } from './_components/order-client';

export default async function OrdersPage({ params }: Readonly<WithParams>) {
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

  const orders = await prismadb.order.findMany({
    where: {
      storeId
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedOrders: OrderColumn[] = orders.map(({ orderItems, createdAt, ...rest }) => ({
    ...rest,
    products: orderItems.map((orderItem) => orderItem.product.name).join(', '),
    totalPrice: currencyFormatter.format(orderItems.reduce((acc, orderItem) => acc + Number(orderItem.product.price), 0)),
    createdAt: format(createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <>
      {/* <h1>Orders Page</h1> */}
      {/* <p>{store?.name}</p> */}
      {/* <p>{store?.userId}</p> */}
      <OrderClient orders={formattedOrders} />
    </>
  )
}
