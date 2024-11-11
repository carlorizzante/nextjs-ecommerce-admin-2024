"use client";

import {
  useEffect,
  useState,
} from 'react';
import { StoreModal } from '@/components/modals';
import { WithChildren } from '@/lib/types';

export const ModalProvider = ({ children }: WithChildren) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <StoreModal />
      {children}
    </>
  );
}
