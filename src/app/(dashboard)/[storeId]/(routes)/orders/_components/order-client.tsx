"use client";

import { DataTable } from '@/components/data-table';
import { Heading } from '@/components/heading';
import { Separator } from '@/components/ui/separator';
import { WithClassName } from '@/lib/types';
import {
  columns,
  OrderColumn,
} from './columns';

type OrderClientProps = WithClassName & {
  orders: OrderColumn[];
}

export const OrderClient = ({ orders }: OrderClientProps) => {
  const ordersCount = orders.length;

  return (
    <>
      <Heading
        title={`Orders (${ordersCount})`}
        description="Manage your orders here"
      />
      <Separator className="my-4" />
      <DataTable columns={columns} data={orders} searchKey="products" />
    </>
  );
}
