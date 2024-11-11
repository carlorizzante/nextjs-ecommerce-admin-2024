"use client";

import { Modal } from '@/components/modal';
import { useStoreModal } from '@/hooks/use-store-modal';

export const StoreModal = () => {
  const { isOpen, onClose, onOpen } = useStoreModal();
  return (
    <Modal
      isOpen={isOpen}
      title="Create New Store"
      descripton="Add a new store to manage products and categories."
      onClose={onClose}
      onOpen={onOpen}
    >Create Store Form</Modal>
  )
}
