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
import { Billboard } from '@prisma/client';
import { FormImageUploader } from '../form/form-image-uploader';

const FormSchema = z.object({
  name: z.string().min(1),
  imageUrl: z.string(),
});

type FormSchemaValues = z.infer<typeof FormSchema>;

type BillboardFormProps = WithClassName & {
  billboard: Billboard | null;
}

export const BillboardForm = ({ className, billboard }: BillboardFormProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();
  const router = useRouter();
  // const origin = useOrigin();

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
      let response;
      setIsLoading(true);
      if (billboard) {
        response = await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, values);
      } else {
        response = await axios.post(`/api/${params.storeId}/billboards`, values);
      }
      if (response.status === 200) {
        router.refresh();
        router.push(`/${params.storeId}/billboards`);
        toast.success(successMessage);
      } else {
        toast.error(errorMessage);
      }
    }
    catch (error) {
      console.error('BillboardForm > handleSubmit', error);
      toast.error(errorMessage);
    }
    finally {
      setIsLoading(false);
    }
  }

  const handleDelete = async () => {
    console.log('BillboardForm > handleDelete');
    const successMessage = 'Billboard deleted!';
    const errorMessage = 'Failed to delete billboard. Make sure to remove all categories used by this billboard before deleting it.';
    try {
      setIsLoading(true);
      // throw new Error('Not implemented');
      const response = await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
      if (response.status === 200) {
        router.refresh();
        router.push('/');
        toast.success(successMessage);
      } else {
        toast.error(errorMessage);
      }
    }
    catch (error) {
      console.error('BillboardForm > handleDelete', error);
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
        {billboard && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash />
            Delete Billboard
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
        <div className="max-w-xl gap-8">
          <FormInput
            form={form}
            name="name"
            label="Billboard Name"
            disabled={disabled}
            placeholder='Billboard Name...'
          />
          <FormImageUploader
            form={form}
            name="imageUrl"
            label="Billboard Image"
            disabled={disabled}
            description="Upload a billboard image."
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
