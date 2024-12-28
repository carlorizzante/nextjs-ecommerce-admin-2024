"use client";

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';
import {
  Form,
  FormCancel,
  FormInput,
  FormSubmit,
} from '@/components/form';
import { useStoreModal } from '@/hooks/use-store-modal';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from './modal';

const FormSchema = z.object({
  name: z.string().min(1),
});

export const StoreModal = () => {
  const { isOpen, onClose, onOpen } = useStoreModal();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
    }
  });

  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    // console.log('handleSubmit', values);

    try {
      setIsLoading(true);
      const response = await axios.post('/api/stores', values);
      // console.log('StoreModal > respose.data', response.data);
      toast.success('Store created!');
      // window.location.assign(`/${response.data.id}`);
      router.push(`/${response.data.id}`);
      setTimeout(() => {
        onClose();
      }, 1000);

    } catch (error) {
      console.error('StoreModal', error);
      toast.error('Failed to create store.');

    } finally {
      setIsLoading(false);
    }
  }

  const disabled = isLoading;

  return (
    <Modal
      isOpen={isOpen}
      title="Create New Store"
      descripton="Add a new store to manage products and categories."
      onOpen={onOpen}
      onClose={onClose}
    >
      <Form
        form={form}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      >
        <FormInput
          form={form}
          name="name"
          label="Store Name"
          description='The name of the new store.'
          placeholder="My Store"
          disabled={disabled}
        />
        <div className="flex w-full justify-end items-center gap-2">
          <FormSubmit disabled={disabled}>Create Store</FormSubmit>
          <FormCancel onClick={onClose} disabled={disabled}>Cancel</FormCancel>
        </div>
      </Form>
    </Modal>
  )
}
