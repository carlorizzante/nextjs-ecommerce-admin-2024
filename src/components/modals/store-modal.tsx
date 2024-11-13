"use client";

import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormCancel,
  FormInput,
  FormSubmit,
} from '@/components/form';
import { Modal } from '@/components/modal';
import { useStoreModal } from '@/hooks/use-store-modal';
import { zodResolver } from '@hookform/resolvers/zod';

const FormSchema = z.object({
  name: z.string().min(1),
});

export const StoreModal = () => {
  const { isOpen, onClose, onOpen } = useStoreModal();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
    }
  });

  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    // TODO: Create store
    console.log(values);
  }

  return (
    <Modal
      isOpen={isOpen}
      title="Create New Store"
      descripton="Add a new store to manage products and categories."
      onClose={onClose}
      onOpen={onOpen}
    >
      <Form
        form={form}
        onSubmit={handleSubmit}
      >
        <FormInput
          form={form}
          name="name"
          label="Store Name"
          description='The name of the new store.'
        />
        <div className="flex w-full justify-end items-center gap-2">
          <FormSubmit>Create Store</FormSubmit>
          <FormCancel onClick={onClose}>Cancel</FormCancel>
        </div>
      </Form>
    </Modal>
  )
}
