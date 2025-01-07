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
  SizeColumn,
} from './columns';

type SizeClientProps = WithClassName & {
  sizes: SizeColumn[];
}

export const SizeClient = ({ sizes }: SizeClientProps) => {
  const params = useParams();
  const router = useRouter();

  const handleAddSize = () => {
    router.push(`/${params.storeId}/sizes/new`);
  }

  const sizesCount = sizes.length;

  return (
    <>
      <div className="flex justify-between items-center">
        <Heading
          title={`Sizes (${sizesCount})`}
          description="Manage your sizes here"
        />
        <Button onClick={handleAddSize}>
          <Plus className="w-r h-4" />
          Add New Size
        </Button>
      </div>
      <Separator className="my-4" />
      <DataTable columns={columns} data={sizes} searchKey="name" />
      <Separator className="my-4" />
      <Heading title="API" description="API calls for Sizes" />
      <ApiAlertList
        className="mt-4"
        entityName="sizes"
        entityIdName="sizeId"
      />
    </>
  );
}
