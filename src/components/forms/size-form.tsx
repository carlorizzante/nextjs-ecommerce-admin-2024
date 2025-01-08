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
import { FormSubmit } from '@/components/form/form-submit';
import { Heading } from '@/components/heading';
import { AlertModal } from '@/components/modals/alert-modal';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { WithClassName } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Size } from '@prisma/client';

const FormSchema = z.object({
  name: z.string().min(1),
  value: z.string(),
});

type FormSchemaValues = z.infer<typeof FormSchema>;

type SizeFormProps = WithClassName & {
  size: Size | null;
}

export const SizeForm = ({ className, size }: SizeFormProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();
  const router = useRouter();

  const disabled = isLoading;
  const title = size ? 'Edit Size' : 'Create Size';
  const description = size ? 'Update your size settings.' : 'Create a new size.';
  const successMessage = size ? 'Size updated!' : 'Size created!';
  const errorMessage = size ? 'Failed to update size.' : 'Failed to create size.';
  const action = size ? 'Save Changes' : 'Create Size';

  const form = useForm<FormSchemaValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: size || {
      name: '',
      value: '',
    }
  });

  const handleSubmit = async (values: FormSchemaValues) => {
    // console.log('StoreSettingsForm > handleSubmit', values);
    try {
      let response;
      setIsLoading(true);
      if (size) {
        response = await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, values);
      } else {
        response = await axios.post(`/api/${params.storeId}/sizes`, values);
      }
      if (response.status === 200) {
        router.refresh();
        router.push(`/${params.storeId}/sizes`);
        toast.success(successMessage);
      } else {
        toast.error(errorMessage);
      }
    }
    catch (error) {
      console.error('SizeForm > handleSubmit', error);
      toast.error(errorMessage);
    }
    finally {
      setIsLoading(false);
    }
  }

  const handleDelete = async () => {
    console.log('SizeForm > handleDelete');
    const successMessage = 'Size deleted!';
    const errorMessage = 'Failed to delete size. Make sure to remove all products used by this size before deleting it.';
    try {
      setIsLoading(true);
      // throw new Error('Not implemented');
      const response = await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);
      if (response.status === 200) {
        router.refresh();
        router.push(`/${params.storeId}/sizes`);
        toast.success(successMessage);
      } else {
        toast.error(errorMessage);
      }
    }
    catch (error) {
      console.error('SizeForm > handleDelete', error);
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
        {size && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash />
            Delete Size
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
          label="Size Name"
          disabled={disabled}
          placeholder='Size Name...'
        />
        <FormInput
          form={form}
          name="value"
          label="Size Value"
          disabled={disabled}
          placeholder='Size Value...'
        />
        <div className="flex w-full items-center gap-2">
          <FormSubmit disabled={disabled}>{action}</FormSubmit>
          <FormCancel onClick={() => null} disabled={disabled}>Cancel</FormCancel>
        </div>
      </Form>
    </>
  );
}
