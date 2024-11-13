import { SelectItem } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { SelectItemProps } from '@radix-ui/react-select';

// TODO: Implement disabled state
export const FormSelectOption = ({ children, className, ...rest }: SelectItemProps) => (
  <SelectItem
    className={cn('cursor-pointer', className)}
    {...rest}
  >{children}</SelectItem>
)
