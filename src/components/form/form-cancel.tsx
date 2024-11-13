import {
  Button,
  ButtonProps,
} from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const FormCancel = ({ className, children, disabled }: ButtonProps) => (
  <Button
    type="submit"
    className={cn(className)}
    disabled={disabled}
    variant="outline"
  >{children}</Button>
)
