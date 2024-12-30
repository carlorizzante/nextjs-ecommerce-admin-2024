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
import { useOrigin } from '@/hooks';
import { WithClassName } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Billboard } from '@prisma/client';
import { Form } from '../form/form';
import { FormCancel } from '../form/form-cancel';
import { FormInput } from '../form/form-input';
import { FormSubmit } from '../form/form-submit';
import { Heading } from '../heading';
import { AlertModal } from '../modals/alert-modal';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

const FormSchema = z.object({
  name: z.string().min(1),
  imageUrl: z.string().min(1),
});

type FormSchemaValues = z.infer<typeof FormSchema>;

type BillboardFormProps = WithClassName & {
  billboard: Billboard | null;
}

export const BillboardForm = ({ className, billboard }: BillboardFormProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Remove this as soon as open is used.
  console.log(open);

  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  console.log(params, router, origin);

  const disabled = isLoading;
  const title = billboard ? 'Edit Billboard' : 'Create Billboard';
  const description = billboard ? 'Update your billboard settings.' : 'Create a new billboard.';
  const successMessage = billboard ? 'Billboard updated!' : 'Billboard created!';
  const errorMessage = billboard ? 'Failed to update billboard.' : 'Failed to create billboard.';
  const action = billboard ? 'Save Changes' : 'Create Billboard';

  const form = useForm<FormSchemaValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: billboard || {
      name: '',
      imageUrl: '',
    }
  });

  const handleSubmit = async (values: FormSchemaValues) => {
    // console.log('StoreSettingsForm > handleSubmit', values);
    try {
      setIsLoading(true);
      const response = await axios.patch(`/api/billboards/${billboard?.id}`, values);
      if (response.status === 200) {
        router.refresh();
        toast.success(successMessage);
      } else {
        toast.error(errorMessage);
      }
    }
    catch (error) {
      console.error('StoreSettingsForm', error);
      toast.error(errorMessage);
    }
    finally {
      setIsLoading(false);
    }
  }

  const handleDelete = async () => {
    // console.log('BillboardForm > handleDelete');
    try {
      setIsLoading(true);
      // throw new Error('Not implemented');
      const response = await axios.delete(`/api/billboards/${billboard?.id}`);
      if (response.status === 200) {
        router.refresh();
        router.push('/');
        toast.success('Billboard deleted!');
      } else {
        toast.error('Failed to delete billboard. Make sure to remove all products from billboard before deleting it.');
      }
    }
    catch (error) {
      console.error('BillboardForm', error);
      toast.error('Failed to delete billboard. Make sure to remove all products from billboard before deleting it.');
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
        {billboard && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash />
            Delete Store
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
        <div className="grid grid-cols-3 gap-8">
          <FormInput
            form={form}
            name="name"
            label="Billboard Name"
            disabled={disabled}
            placeholder='Billboard Name...'
          />
        </div>
        <div className="flex w-full justify-end items-center gap-2">
          <FormSubmit disabled={disabled}>{action}</FormSubmit>
          <FormCancel onClick={() => null} disabled={disabled}>Cancel</FormCancel>
        </div>
      </Form>
      <Separator className="my-4" />
    </>
  );
}
