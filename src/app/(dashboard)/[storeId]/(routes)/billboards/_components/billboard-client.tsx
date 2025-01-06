"use client";

import { Plus } from 'lucide-react';
import {
  useParams,
  useRouter,
} from 'next/navigation';
import { DataTable } from '@/components/data-table';
import { Heading } from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { WithClassName } from '@/lib/types';
import {
  BillboardColumn,
  columns,
} from './columns';

type BillboardClientProps = WithClassName & {
  billboards: BillboardColumn[];
}

export const BillboardClient = ({ billboards }: BillboardClientProps) => {
  const params = useParams();
  const router = useRouter();

  const handleAddBillboard = () => {
    router.push(`/${params.storeId}/billboards/new`);
  }

  const billboardsCount = billboards.length;

  return (
    <>
      <div className="flex justify-between items-center">
        <Heading
          title={`Billboards (${billboardsCount})`}
          description="Manage your billboards here"
        />
        <Button onClick={handleAddBillboard}>
          <Plus className="w-r h-4" />
          Add New Billboard
        </Button>
      </div>
      <Separator className="my-4" />
      <DataTable columns={columns} data={billboards} searchKey="name" />
    </>
  );
}
