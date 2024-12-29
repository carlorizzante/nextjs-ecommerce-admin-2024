'use client';

import { useState } from 'react';
import {
  Check,
  ChevronsUpDown,
  PlusCircle,
  Store as StoreIcon,
} from 'lucide-react';
import {
  useParams,
  useRouter,
} from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useStoreModal } from '@/hooks/use-store-modal';
import { cn } from '@/lib/utils';
import { Store } from '@prisma/client';
import { PopoverTriggerProps } from '@radix-ui/react-popover';

// How to infer the type of a parent component
// type PopoverTriggerProps_ALTERNATIVE = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

type StoreSwitcherProps = PopoverTriggerProps & {
  items: Store[];
}

export const StoreSwitcher = ({ className, items = [] }: StoreSwitcherProps) => {
  const storeModal = useStoreModal();
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const currentStore = formattedItems.find((item) => item.value === params.storeId);

  const onStoreSelect = (store: { label: string; value: string; }) => {
    setOpen(false);
    router.push(`/${store.value}`);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a Store"
          className={cn('flex items-center w-[200px] justify-between', className)}
        >
          <StoreIcon className="w-4 h-4" />
          <span className="">{currentStore?.label}</span>
          <ChevronsUpDown className="w-4 h-4 ml-auto shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search Store..." />
            <CommandEmpty>No Store Found</CommandEmpty>
            <CommandGroup heading="Stores">
              {formattedItems.map((item) => (
                <CommandItem
                  key={item.value}
                  className="text-sm"
                  onSelect={() => onStoreSelect(item)}
                >
                  <StoreIcon className="w-4 h-4" />
                  {item.label}
                  <Check className={cn(
                    'w-4 h-4 ml-auto',
                    currentStore?.value === item.value ? 'opacity-100' : 'opacity-0'
                  )} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                className="text-sm"
                onSelect={storeModal.onOpen}
              >
                <PlusCircle className="w-4 h-4" />
                Create New Store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
