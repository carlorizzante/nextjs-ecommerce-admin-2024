import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type FormSelectProps = Omit<React.ComponentProps<"input">, 'form'> & {
  description?: React.ReactNode;
  /* eslint-disable-next-line */
  form: UseFormReturn<any>;
  label?: string;
}

// TODO: implement disabled prop
export const FormSelect = ({
  className,
  description,
  // disabled,
  form,
  label,
  name = '',
  placeholder,
  ...props
}: FormSelectProps) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem className={className}>
        {(label && props.type !== 'hidden') && <FormLabel className="font-semibold">{label}</FormLabel>}
        <Select
          onValueChange={field.onChange}
          defaultValue={field.value}
          value={field.value}
        >
          <FormControl>
            <SelectTrigger className="pr-2 bg-white">
              <SelectValue placeholder={placeholder}>{field.value}</SelectValue>
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {props.children}
          </SelectContent>
        </Select>
        {description && <FormDescription>
          {description}
        </FormDescription>}
        <FormMessage {...field} />
      </FormItem>
    )}
  />
)
