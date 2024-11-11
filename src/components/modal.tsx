"use client";

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { WithChildren } from '@/lib/types';

export type ModalProps = WithChildren & {
  descripton: string;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  title: string;
}

export const Modal: React.FC<ModalProps> = ({
  children,
  descripton,
  isOpen,
  onClose,
  title,
}) => {
  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  }
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{descripton}</DialogDescription>
        </DialogHeader>
        <div>
          {children}
        </div>
      </DialogContent>
      <DialogFooter>
        <Button onClick={() => handleOpenChange(false)}>Close</Button>
      </DialogFooter>
    </Dialog>
  );
}
