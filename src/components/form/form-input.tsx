import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type FormInputProps = Omit<React.ComponentProps<"input">, 'form'> & {
  description?: string;
  /* eslint-disable-next-line */
  form: UseFormReturn<any>;
  label?: string;
  name: string;
}

export const FormInput = ({
  className,
  description,
  disabled,
  form,
  label,
  name,
  type,
  ...props
}: FormInputProps) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem>
        {(label && type !== 'hidden') && <FormLabel>{label}</FormLabel>}
        <FormControl>
          <Input
            {...field}
            name={name}
            disabled={disabled || form.formState.isSubmitting}
            className={cn(className)}
            {...props}
          />
        </FormControl>
        {(description && type !== 'hidden') && <FormDescription>{description}</FormDescription>}
        {type !== 'hidden' && <FormMessage {...field} />}
      </FormItem>
    )}
  />
)
