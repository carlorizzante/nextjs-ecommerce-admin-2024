"use client";

import { Plus } from 'lucide-react';
import {
  useParams,
  useRouter,
} from 'next/navigation';
import { Heading } from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export const BillboardClient = () => {
  const params = useParams();
  const router = useRouter();

  const handleAddBillboard = () => {
    router.push(`/${params.storeId}/billboards/new`);
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <Heading
          title="Some Billboard"
          description="Manage your billboards here"
        />
        <Button onClick={handleAddBillboard}>
          <Plus className="w-r h-4" />
          Add New Billboard
        </Button>
      </div>
      <Separator className="my-4" />
    </>
  );
}
