"use client";

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useStoreModal } from '@/hooks/use-store-modal';
import {
  SignInButton,
  UserButton,
} from '@clerk/nextjs';

export default function SetupPage() {
  // const { isOpen, onOpen } = useStoreModal();
  const isOpen = useStoreModal((state) => state.isOpen);
  const onOpen = useStoreModal((state) => state.onOpen);

  useEffect(() => {
    // Rework onOpen in some meaningful way, or remove it
    if (!isOpen && onOpen) onOpen();
  }, [isOpen, onOpen]);

  // Only use setup up for triggering the modal
  return null;

  // Potentially show some content here in the future
  return (
    <>
      <p>Admin Dashboard</p>
      <div>
        <UserButton />
        <SignInButton />
      </div>
      <Button onClick={onOpen}>Open Modal</Button>
    </>
  );
}
