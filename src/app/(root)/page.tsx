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
    if (!isOpen) onOpen();
  }, [isOpen, onOpen]);

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
