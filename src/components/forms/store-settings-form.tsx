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
import { ApiAlert } from '@/components/api-alert';
import {
  Form,
  FormCancel,
  FormInput,
  FormSubmit,
} from '@/components/form';
import { Heading } from '@/components/heading';
import { AlertModal } from '@/components/modals/alert-modal';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useOrigin } from '@/hooks';
import { WithClassName } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Store } from '@prisma/client';

const FormSchema = z.object({
  name: z.string().min(1),
});

type FormSchemaValues = z.infer<typeof FormSchema>;

type StoreSettingsFormProps = WithClassName & {
  store: Store;
}

export const StoreSettingsForm = ({ className, store }: StoreSettingsFormProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Remove this as soon as open is used.
  console.log(open);

  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const form = useForm<FormSchemaValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: store
  });

  const handleSubmit = async (values: FormSchemaValues) => {
    // console.log('StoreSettingsForm > handleSubmit', values);
    try {
      setIsLoading(true);
      const response = await axios.patch(`/api/stores/${params.storeId}`, values);
      if (response.status === 200) {
        router.refresh();
        toast.success('Store updated!');
      } else {
        toast.error('Failed to update store.');
      }
    }
    catch (error) {
      console.error('StoreSettingsForm', error);
      toast.error('Failed to update store.');
    }
    finally {
      setIsLoading(false);
    }
  }

  const handleDelete = async () => {
    // console.log('StoreSettingsForm > handleDelete');
    try {
      setIsLoading(true);
      // throw new Error('Not implemented');
      const response = await axios.delete(`/api/stores/${params.storeId}`);
      if (response.status === 200) {
        router.refresh();
        router.push('/');
        toast.success('Store deleted!');
      } else {
        toast.error('Failed to delete store. Make sure to remove all products from store before deleting it.');
      }
    }
    catch (error) {
      console.error('StoreSettingsForm', error);
      toast.error('Failed to delete store. Make sure to remove all products from store before deleting it.');
    }
    finally {
      setIsLoading(false);
    }
  }

  const disabled = isLoading;

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
          title="Store Settings"
          description="Update your store settings."
        />
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setOpen(true)}
        >
          <Trash />
          Delete Store
        </Button>
      </div>
      <Separator className="my-4" />
      <Form
        form={form}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        className={className}
      >
        <div className="grid grid-cols-3 gap-8">
          <FormInput
            form={form}
            name="name"
            label="Name of the Store"
            disabled={disabled}
            placeholder='Store Name...'
          />
        </div>
        <div className="flex w-full items-center gap-2">
          <FormSubmit disabled={disabled}>Save Changes</FormSubmit>
          <FormCancel onClick={() => null} disabled={disabled}>Cancel</FormCancel>
        </div>
      </Form>
      <Separator className="my-4" />
      <ApiAlert title="NEXT_PUBLIC_API_URL" description={`${origin}/api/${params.storeId}`} variant="public" />
    </>
  );
}
