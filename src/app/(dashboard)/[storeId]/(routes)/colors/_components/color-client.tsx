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
  ColorColumn,
  columns,
} from './columns';

type ColorClientProps = WithClassName & {
  colors: ColorColumn[];
}

export const ColorClient = ({ colors }: ColorClientProps) => {
  const params = useParams();
  const router = useRouter();

  const handleAddColor = () => {
    router.push(`/${params.storeId}/colors/new`);
  }

  const colorsCount = colors.length;

  return (
    <>
      <div className="flex justify-between items-center">
        <Heading
          title={`Colors (${colorsCount})`}
          description="Manage your colors here"
        />
        <Button onClick={handleAddColor}>
          <Plus className="w-r h-4" />
          Add New Color
        </Button>
      </div>
      <Separator className="my-4" />
      <DataTable columns={columns} data={colors} searchKey="name" />
      <Separator className="my-4" />
      <Heading title="API" description="API calls for Colors" />
      <ApiAlertList
        className="mt-4"
        entityName="colors"
        entityIdName="colorId"
      />
    </>
  );
}
