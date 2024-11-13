import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type FormTextareaProps = Omit<React.ComponentProps<"textarea">, 'form'> & {
  /* eslint-disable-next-line */
  form: UseFormReturn<any>;
  label?: string;
}

export const FormTextarea = ({
  disabled,
  form,
  label,
  name = '',
  className,
  ...props
}: FormTextareaProps) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem>
        {label && <FormLabel className="font-semibold">{label}</FormLabel>}
        <FormControl>
          <Textarea
            {...field}
            disabled={disabled || form.formState.isSubmitting}
            className={cn(
              'min-h-[40px]',
              'border-none focus:border-primary focus:ring-primary focus:ring-opacity-50 focus:ring-1',
              'bg-white rounded-md',
              'resize-none',
              className
            )}
            {...props}
          />
        </FormControl>
        <FormMessage {...field} />
      </FormItem>
    )}
  />
)
