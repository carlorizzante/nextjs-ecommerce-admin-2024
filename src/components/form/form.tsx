import {
  FieldValues,
  UseFormReturn,
} from 'react-hook-form';
import * as z from 'zod';
import { Form as ShadcnUIForm } from '@/components/ui/form';
import {
  WithChildren,
  WithClassName,
} from '@/lib/types';
import { cn } from '@/lib/utils';

type FormProps<
  TFieldValues extends FieldValues,
// TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = WithChildren & WithClassName & {
  /* eslint-disable-next-line */
  form: UseFormReturn<TFieldValues, any, undefined>;
  /* eslint-disable-next-line */
  onSubmit: (values: z.infer<any>) => void
  disabled?: boolean;
  isLoading?: boolean;
  isPending?: boolean;
  messages?: {
    success?: string;
    error?: string;
  },
};

export const Form = <TFieldValues extends FieldValues>({
  children,
  className,
  form,
  isLoading,
  onSubmit,
  messages,
  ...props
}: FormProps<TFieldValues>) => (
  <ShadcnUIForm {...form} {...props}>
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn(
        isLoading ? 'opacity-50' : undefined,
        'w-full space-y-4',
        className
      )}
    >
      {children}
      {/* <FormMessage {...messages} /> */}
      {messages && <p>{String(messages)}</p>}
    </form>
  </ShadcnUIForm>
)
