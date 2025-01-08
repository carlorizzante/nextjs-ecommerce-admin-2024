"use client";

import { Plus } from 'lucide-react';
import {
  useParams,
  useRouter,
} from 'next/navigation';
import { ApiAlertList } from '@/components/api-alert-list';
import { DataTable } from '@/components/data-table';
import { Heading } from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { WithClassName } from '@/lib/types';
import {
  columns,
  ProductColumn,
} from './columns';

type ProductClientProps = WithClassName & {
  products: ProductColumn[];
}

export const ProductClient = ({ products }: ProductClientProps) => {
  const params = useParams();
  const router = useRouter();

  const handleAddProduct = () => {
    router.push(`/${params.storeId}/products/new`);
  }

  const productsCount = products.length;

  return (
    <>
      <div className="flex justify-between items-center">
        <Heading
          title={`Products (${productsCount})`}
          description="Manage your products here"
        />
        <Button onClick={handleAddProduct}>
          <Plus className="w-r h-4" />
          Add New Product
        </Button>
      </div>
      <Separator className="my-4" />
      <DataTable columns={columns} data={products} searchKey="name" />
      <Separator className="my-4" />
      <Heading title="API" description="API calls for Products" />
      <ApiAlertList
        className="mt-4"
        entityName="products"
        entityIdName="productId"
      />
    </>
  );
}
