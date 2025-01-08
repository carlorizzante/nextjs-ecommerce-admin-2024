"use client";

import { useState } from 'react';
import axios from 'axios';
import { Trash } from 'lucide-react';
import {
  useParams,
  useRouter,
} from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';
import { Form } from '@/components/form/form';
import { FormCancel } from '@/components/form/form-cancel';
import { FormInput } from '@/components/form/form-input';
import { FormSubmit } from '@/components/form/form-submit';
import { Heading } from '@/components/heading';
import { AlertModal } from '@/components/modals/alert-modal';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { WithClassName } from '@/lib/types';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Category,
  Color,
  Product,
  Size,
} from '@prisma/client';
import { FormCheckbox } from '../form/form-checkbox';
import { FormSelect } from '../form/form-select';
import { FormSelectOption } from '../form/form-select-option';
import { ImageUploader } from '../form/image-uploader';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '../ui/form';

const FormSchema = z.object({
  name: z.string().min(1),
  images: z.object({ url: z.string().url() }).array(),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  colorId: z.string().min(1),
  sizeId: z.string().min(1),
  isFeatured: z.boolean(),
  isArchived: z.boolean(),
});

type FormSchemaValues = z.infer<typeof FormSchema>;

type ProductWithImages = Product

type ProductFormProps = WithClassName & {
  product: ProductWithImages | null;
  categories: Category[];
  colors: Color[];
  sizes: Size[];
}

export const ProductForm = ({ className, product, categories, colors, sizes }: ProductFormProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();
  const router = useRouter();

  const disabled = isLoading;
  const title = product ? 'Edit Product' : 'Create Product';
  const description = product ? 'Update your product settings.' : 'Create a new product.';
  const successMessage = product ? 'Product updated!' : 'Product created!';
  const errorMessage = product ? 'Failed to update product.' : 'Failed to create product.';
  const action = product ? 'Save Changes' : 'Create Product';

  const form = useForm<FormSchemaValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: product ? {
      ...product,
      price: Number(product.price),
    } : {
      name: '',
      images: [],
      // price: 0,
      categoryId: '',
      colorId: '',
      sizeId: '',
      isFeatured: false,
      isArchived: false,
    }
  });

  const handleSubmit = async (values: FormSchemaValues) => {
    console.log('StoreSettingsForm > handleSubmit', values);
    try {
      let response;
      setIsLoading(true);
      if (product) {
        response = await axios.patch(`/api/${params.storeId}/products/${params.productId}`, values);
      } else {
        response = await axios.post(`/api/${params.storeId}/products`, values);
      }
      if (response.status === 200) {
        router.refresh();
        router.push(`/${params.storeId}/products`);
        toast.success(successMessage);
      } else {
        toast.error(errorMessage);
      }
    }
    catch (error) {
      console.error('ProductForm > handleSubmit', error);
      toast.error(errorMessage);
    }
    finally {
      setIsLoading(false);
    }
  }

  const handleDelete = async () => {
    console.log('ProductForm > handleDelete');
    const successMessage = 'Product deleted!';
    const errorMessage = 'Failed to delete product. Make sure to remove all categories used by this product before deleting it.';
    try {
      setIsLoading(true);
      // throw new Error('Not implemented');
      const response = await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      if (response.status === 200) {
        router.refresh();
        router.push(`/${params.storeId}/products`);
        toast.success(successMessage);
      } else {
        toast.error(errorMessage);
      }
    }
    catch (error) {
      console.error('ProductForm > handleDelete', error);
      toast.error(errorMessage);
    }
    finally {
      setIsLoading(false);
    }
  }

  console.log('form.getValues(images)', form.getValues('images'));

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        loading={isLoading}
      />
      <div className="flex w-full justify-between items-center">
        <Heading
          title={title}
          description={description}
        />
        {product && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash />
            Delete Product
          </Button>
        )}
      </div>
      <Separator className="my-4" />
      <Form
        form={form}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        className={className}
      >
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Images</FormLabel>
              <FormControl>
                <ImageUploader
                  {...field}
                  disabled={disabled}
                  value={field.value.map((image) => image.url)}
                  onChange={(url) => field.onChange([...field.value, { url }])}
                  onRemove={(url) => field.onChange(field.value.filter((image) => image.url !== url))}
                  className={cn('bg-white', className)}

                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormInput
          form={form}
          name="name"
          label="Product Name"
          disabled={disabled}
          placeholder='Product Name...'
        />
        <FormInput
          form={form}
          name="price"
          label="Product Price"
          type="number"
          disabled={disabled}
          placeholder='9.99'
        />
        <FormSelect
          form={form}
          name="categoryId"
          label="Category"
          disabled={disabled}
          placeholder='Select a category...'
        >
          {categories.map((category) => (
            <FormSelectOption key={category.id} value={category.id}>
              {category.name}
            </FormSelectOption>
          ))}
        </FormSelect>
        <FormSelect
          form={form}
          name="sizeId"
          label="Size"
          disabled={disabled}
          placeholder='Select a size...'
        >
          {sizes.map((size) => (
            <FormSelectOption key={size.id} value={size.id}>
              {size.name}
            </FormSelectOption>
          ))}
        </FormSelect>
        <FormSelect
          form={form}
          name="colorId"
          label="Color"
          disabled={disabled}
          placeholder='Select a color...'
        >
          {colors.map((color) => (
            <FormSelectOption key={color.id} value={color.id}>
              <div className="flex items-center gap-2">
                <div
                  className="h-4 w-4 rounded-full border"
                  style={{ backgroundColor: color.value }}
                />
                <span>{color.name}</span>
              </div>
            </FormSelectOption>
          ))}
        </FormSelect>
        <FormCheckbox
          form={form}
          name="isFeatured"
          label="Featured"
          disabled={disabled}
        />
        <FormCheckbox
          form={form}
          name="isArchived"
          label="Archived"
          disabled={disabled}
        />
        <div className="flex w-full items-center gap-2">
          <FormSubmit disabled={disabled}>{action}</FormSubmit>
          <FormCancel onClick={() => null} disabled={disabled}>Cancel</FormCancel>
        </div>
      </Form>
    </>
  );
}
