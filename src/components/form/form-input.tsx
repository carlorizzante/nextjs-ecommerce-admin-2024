import {
  FieldPath,
  FieldValues,
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
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = Omit<React.ComponentProps<"input">, 'form'> & {
  description?: string;
  /* eslint-disable-next-line */
  form: UseFormReturn<{ name: TName; }, any, undefined>;
  label?: string;
  name: TName;
}

export const FormInput =
  // <
  //   TFieldValues extends FieldValues = FieldValues,
  //   TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
  // >
  ({
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
      name={name as 'name'}
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
