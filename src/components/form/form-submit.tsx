import {
  Button,
  ButtonProps,
} from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const FormSubmit = ({ className, children, disabled }: ButtonProps) => (
  <Button
    type="submit"
    className={cn(className)}
    disabled={disabled}
  >{children}</Button>
)
