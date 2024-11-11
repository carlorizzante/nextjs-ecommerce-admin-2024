"use client";

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useStoreModal } from '@/hooks/use-store-modal';
import {
  SignInButton,
  UserButton,
} from '@clerk/nextjs';

export default function SetupPage() {
  const { isOpen, onOpen } = useStoreModal();

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
      {/* <Modal
        isOpen={true}
        title="Test Modal"
        descripton="This is a test modal"
        onClose={() => null}
      /> */}
    </>
  );
}
