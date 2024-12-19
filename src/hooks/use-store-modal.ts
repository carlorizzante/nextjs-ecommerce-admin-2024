import { create } from 'zustand';
import { ModalProps } from '@/components/modals/modal';

type UseStoreModalStore = Pick<ModalProps, 'isOpen' | 'onClose' | 'onOpen'>;

export const useStoreModal = create<UseStoreModalStore>((set) => ({
  isOpen: false,
  onClose: () => set({ isOpen: false }),
  onOpen: () => set({ isOpen: true }),
}));
