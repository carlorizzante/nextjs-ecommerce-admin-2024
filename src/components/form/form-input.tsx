import {
  FieldValues,
  Path,
  UseFormReturn,
} from 'react-hook-form';
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

type FormInputProps<
  TFieldValues extends FieldValues,
// TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = Omit<React.ComponentProps<"input">, 'form'> & {
  description?: string;
  /* eslint-disable-next-line */
  form: UseFormReturn<TFieldValues, any, undefined>;
  label?: string;
  name: Path<TFieldValues>;
}

export const FormInput = <TFieldValues extends FieldValues>({
  className,
  description,
  disabled,
  form,
  label,
  ...props
}: FormInputProps<TFieldValues>) => (
  <FormField
    control={form.control}
    name={props.name}
    render={({ field }) => (
      <FormItem>
        {(label && props.type !== 'hidden') && <FormLabel className="font-semibold">{label}</FormLabel>}
        <FormControl>
          <Input
            {...field}
            disabled={disabled || form.formState.isSubmitting}
            className={cn('bg-white', className)}
            {...props}
          />
        </FormControl>
        {(description && props.type !== 'hidden') && <FormDescription>{description}</FormDescription>}
        {props.type !== 'hidden' && <FormMessage {...field} />}
      </FormItem>
    )}
  />
)
