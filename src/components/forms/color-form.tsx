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
import { Color } from '@prisma/client';

const FormSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(4).regex(/^#([0-9A-F]{3}){1,2}$/i, {
    message: 'Invalid hex color code',
  }),
});

type FormSchemaValues = z.infer<typeof FormSchema>;

type ColorFormProps = WithClassName & {
  color: Color | null;
}

export const ColorForm = ({ className, color }: ColorFormProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();
  const router = useRouter();

  const disabled = isLoading;
  const title = color ? 'Edit Color' : 'Create Color';
  const description = color ? 'Update your color settings.' : 'Create a new color.';
  const successMessage = color ? 'Color updated!' : 'Color created!';
  const errorMessage = color ? 'Failed to update color.' : 'Failed to create color.';
  const action = color ? 'Save Changes' : 'Create Color';

  const form = useForm<FormSchemaValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: color || {
      name: '',
      value: '',
    }
  });

  const handleSubmit = async (values: FormSchemaValues) => {
    // console.log('StoreSettingsForm > handleSubmit', values);
    try {
      let response;
      setIsLoading(true);
      if (color) {
        response = await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, values);
      } else {
        response = await axios.post(`/api/${params.storeId}/colors`, values);
      }
      if (response.status === 200) {
        router.refresh();
        router.push(`/${params.storeId}/colors`);
        toast.success(successMessage);
      } else {
        toast.error(errorMessage);
      }
    }
    catch (error) {
      console.error('ColorForm > handleSubmit', error);
      toast.error(errorMessage);
    }
    finally {
      setIsLoading(false);
    }
  }

  const handleDelete = async () => {
    console.log('ColorForm > handleDelete');
    const successMessage = 'Color deleted!';
    const errorMessage = 'Failed to delete color. Make sure to remove all products used by this color before deleting it.';
    try {
      setIsLoading(true);
      // throw new Error('Not implemented');
      const response = await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
      if (response.status === 200) {
        router.refresh();
        router.push(`/${params.storeId}/colors`);
        toast.success(successMessage);
      } else {
        toast.error(errorMessage);
      }
    }
    catch (error) {
      console.error('ColorForm > handleDelete', error);
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
        {color && (
          <Button
            variant="destructive"
            color="sm"
            onClick={() => setOpen(true)}
          >
            <Trash />
            Delete Color
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
            label="Color Name"
            disabled={disabled}
            placeholder='Color Name...'
          />
          <div className="flex items-center gap-2">
            <FormInput
              form={form}
              name="value"
              label="Color Value"
              disabled={disabled}
              placeholder='Color Value...'
            />
            <div
              className="w-6 h-6 mt-8 rounded-full border"
              style={{ backgroundColor: form.watch('value') }}
            />
          </div>
        </div>
        <div className="flex w-full justify-end items-center gap-2">
          <FormSubmit disabled={disabled}>{action}</FormSubmit>
          <FormCancel onClick={() => null} disabled={disabled}>Cancel</FormCancel>
        </div>
      </Form>
    </>
  );
}
