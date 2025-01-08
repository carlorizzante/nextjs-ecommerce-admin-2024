"use client";

import { useState } from 'react';
import axios from 'axios';
import { Trash } from 'lucide-react';
import {
  useParams,
  useRouter,
} from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';
import { Form } from '@/components/form/form';
import { FormCancel } from '@/components/form/form-cancel';
import { FormInput } from '@/components/form/form-input';
import { FormSelect } from '@/components/form/form-select';
import { FormSelectOption } from '@/components/form/form-select-option';
import { FormSubmit } from '@/components/form/form-submit';
import { Heading } from '@/components/heading';
import { AlertModal } from '@/components/modals/alert-modal';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { WithClassName } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Billboard,
  Category,
} from '@prisma/client';

const FormSchema = z.object({
  name: z.string().min(1),
  billboardId: z.string(),
});

type FormSchemaValues = z.infer<typeof FormSchema>;

type CategoryFormProps = WithClassName & {
  category: Category | null;
  billboards: Billboard[];
}

export const CategoryForm = ({ className, category, billboards }: CategoryFormProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();
  const router = useRouter();

  const disabled = isLoading;
  const title = category ? 'Edit Category' : 'Create Category';
  const description = category ? 'Update your category settings.' : 'Create a new category.';
  const successMessage = category ? 'Category updated!' : 'Category created!';
  const errorMessage = category ? 'Failed to update category.' : 'Failed to create category.';
  const action = category ? 'Save Changes' : 'Create Category';

  const form = useForm<FormSchemaValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: category || {
      name: '',
      billboardId: '',
    }
  });

  const handleSubmit = async (values: FormSchemaValues) => {
    // console.log('StoreSettingsForm > handleSubmit', values);
    try {
      let response;
      setIsLoading(true);
      if (category) {
        response = await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, values);
      } else {
        response = await axios.post(`/api/${params.storeId}/categories`, values);
      }
      if (response.status === 200) {
        router.refresh();
        router.push(`/${params.storeId}/categories`);
        toast.success(successMessage);
      } else {
        toast.error(errorMessage);
      }
    }
    catch (error) {
      console.error('CategoryForm > handleSubmit', error);
      toast.error(errorMessage);
    }
    finally {
      setIsLoading(false);
    }
  }

  const handleDelete = async () => {
    console.log('CategoryForm > handleDelete');
    const successMessage = 'Category deleted!';
    const errorMessage = 'Failed to delete category. Make sure to remove all products used by this category before deleting it.';
    try {
      setIsLoading(true);
      // throw new Error('Not implemented');
      const response = await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`);
      if (response.status === 200) {
        router.refresh();
        router.push(`/${params.storeId}/categories`);
        toast.success(successMessage);
      } else {
        toast.error(errorMessage);
      }
    }
    catch (error) {
      console.error('CategoryForm > handleDelete', error);
      toast.error(errorMessage);
    }
    finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        loading={isLoading}
      />
      <div className="flex w-full justify-between items-center">
        <Heading
          title={title}
          description={description}
        />
        {category && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash />
            Delete Category
          </Button>
        )}
      </div>
      <Separator className="my-4" />
      <Form
        form={form}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        className={className}
      >
        <FormInput
          form={form}
          name="name"
          label="Category Name"
          disabled={disabled}
          placeholder='Category Name...'
        />
        <FormSelect
          form={form}
          name="billboardId"
          label="Billboard"
          disabled={disabled}
          placeholder='Select a billboard...'
        >
          {billboards.map((billboard) => (
            <FormSelectOption key={billboard.id} value={billboard.id}>
              {billboard.name}
            </FormSelectOption>
          ))}
        </FormSelect>
        <div className="flex w-full items-center gap-2">
          <FormSubmit disabled={disabled}>{action}</FormSubmit>
          <FormCancel onClick={() => null} disabled={disabled}>Cancel</FormCancel>
        </div>
      </Form>
    </>
  );
}
