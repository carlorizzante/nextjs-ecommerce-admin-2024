import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { CheckboxProps } from '@radix-ui/react-checkbox';

type FormCheckboxProps = Omit<CheckboxProps, 'form'> & {
  description?: React.ReactNode;
  /* eslint-disable-next-line */
  form: UseFormReturn<any>;
  hidden?: boolean;
  label?: string;
}

export const FormCheckbox = ({
  className,
  description,
  disabled,
  form,
  hidden,
  label,
  name = '',
  ...props
}: FormCheckboxProps) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow bg-slate-900 text-white">
        <FormControl>
          <Checkbox
            {...field}
            name={name}
            disabled={disabled || form.formState.isSubmitting}
            checked={field.value}
            onCheckedChange={field.onChange}
            className={cn(
              'invert',
              className
            )}
            {...props}
          />
        </FormControl>
        <div className="space-y-3 leading-none">
          {(label && !hidden) && <FormLabel className="font-semibold">{label}</FormLabel>}
          {description && <FormDescription>{description}</FormDescription>}
        </div>
        <FormMessage {...field} />
      </FormItem >
    )}
  />
)
