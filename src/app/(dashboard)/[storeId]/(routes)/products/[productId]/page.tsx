import { ProductForm } from '@/components/forms/product-form';
import prismadb from '@/lib/prismadb';
import { WithParams } from '@/lib/types';

export default async function ProductPage({
  params
}: Readonly<WithParams>) {
  const { storeId, productId } = await params;
  // console.log(storeId, productId);

  const product = await prismadb.product.findUnique({
    where: {
      id: productId,
      storeId
    },
    include: {
      images: true,
      category: true,
      color: true,
      size: true
    }
  });

  const categories = await prismadb.category.findMany({
    where: {
      storeId
    }
  });

  const colors = await prismadb.color.findMany({
    where: {
      storeId
    }
  });

  const sizes = await prismadb.size.findMany({
    where: {
      storeId
    }
  });

  return (
    <>
      {/* <p>Name: {product?.name || 'New?'}</p> */}
      {/* <p>storeId: {storeId}</p> */}
      {/* <p>productId: {productId}</p> */}
      <ProductForm
        product={product}
        categories={categories}
        colors={colors}
        sizes={sizes}
      />
    </>
  );
}
