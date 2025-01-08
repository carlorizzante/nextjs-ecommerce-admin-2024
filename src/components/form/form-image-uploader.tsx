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
import { cn } from '@/lib/utils';
import { ImageUploader } from './image-uploader';

type FormImageUploaderProps<
  TFieldValues extends FieldValues,
// TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = Omit<React.ComponentProps<"input">, 'form'> & {
  description?: string;
  /* eslint-disable-next-line */
  form: UseFormReturn<TFieldValues, any, undefined>;
  label?: string;
  name: Path<TFieldValues>;
}

export const FormImageUploader = <TFieldValues extends FieldValues>({
  className,
  description,
  disabled,
  form,
  label,
  ...props
}: FormImageUploaderProps<TFieldValues>) => (
  <FormField
    control={form.control}
    name={props.name}
    render={({ field }) => (
      <FormItem>
        {(label && props.type !== 'hidden') && <FormLabel className="font-semibold">{label}</FormLabel>}
        <FormControl>
          <ImageUploader
            {...field}
            disabled={disabled}
            onChange={(url) => field.onChange(url)}
            onRemove={() => field.onChange('')}
            value={Array.isArray(field.value) ? field.value : [field.value]}
            className={cn('bg-white', className)}

          />
        </FormControl>
        {(description && props.type !== 'hidden') && <FormDescription>{description}</FormDescription>}
        {props.type !== 'hidden' && <FormMessage {...field} />}
      </FormItem>
    )}
  />
)
