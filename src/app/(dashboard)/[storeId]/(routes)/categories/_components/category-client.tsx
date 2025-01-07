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
  CategoryColumn,
  columns,
} from './columns';

type CategoryClientProps = WithClassName & {
  categories: CategoryColumn[];
}

export const CategoryClient = ({ categories }: CategoryClientProps) => {
  const params = useParams();
  const router = useRouter();

  const handleAddCategory = () => {
    router.push(`/${params.storeId}/categories/new`);
  }

  const categoriesCount = categories.length;

  return (
    <>
      <div className="flex justify-between items-center">
        <Heading
          title={`Categorys (${categoriesCount})`}
          description="Manage your categories here"
        />
        <Button onClick={handleAddCategory}>
          <Plus className="w-r h-4" />
          Add New Category
        </Button>
      </div>
      <Separator className="my-4" />
      <DataTable columns={columns} data={categories} searchKey="name" />
      <Separator className="my-4" />
      <Heading title="API" description="API calls for Categories" />
      <ApiAlertList
        className="mt-4"
        entityName="categories"
        entityIdName="categoryId"
      />
    </>
  );
}
