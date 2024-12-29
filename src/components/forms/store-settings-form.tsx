'use client';

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
import {
  Form,
  FormCancel,
  FormInput,
  FormSubmit,
} from '@/components/form';
import { Heading } from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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

  const disabled = isLoading;

  return (
    <Form
      form={form}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      className={className}
    >
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
      <Separator />
      <div className="grid grid-cols-3 gap-8">
        <FormInput
          form={form}
          name="name"
          label="Name of the Store"
          disabled={disabled}
          placeholder='Store Name...'
        />
      </div>
      <div className="flex w-full justify-end items-center gap-2">
        <FormSubmit disabled={disabled}>Save Changes</FormSubmit>
        <FormCancel onClick={() => null} disabled={disabled}>Cancel</FormCancel>
      </div>
    </Form>
  );
}
