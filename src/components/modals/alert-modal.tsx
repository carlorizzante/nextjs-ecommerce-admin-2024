"use client";

import {
  useEffect,
  useState,
} from 'react';
import { Button } from '../ui/button';
import { Modal } from './modal';

type AlertModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const AlertModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}: AlertModalProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Are you sure?"
      descripton="This action cannot be undone."
    >
      <div className="flex justify-end items-center gap-4 pt-6">
        <Button variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onConfirm} disabled={loading}>
          Confirm
        </Button>
      </div>
    </Modal>
  )
}
