import { CategoryForm } from '@/components/forms/category-form';
import prismadb from '@/lib/prismadb';
import { WithParams } from '@/lib/types';

export default async function CategoryPage({
  params
}: Readonly<WithParams>) {
  const { storeId, categoryId } = await params;
  // console.log(storeId, categoryId);

  const category = await prismadb.category.findUnique({
    where: {
      id: categoryId,
      storeId
    }
  });

  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId
    }
  });

  return (
    <>
      <p>Name: {category?.name || 'New?'}</p>
      <p>storeId: {storeId}</p>
      <p>categoryId: {categoryId}</p>
      <CategoryForm category={category} billboards={billboards} />
    </>
  );
}
