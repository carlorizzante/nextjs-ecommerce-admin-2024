import { SizeForm } from '@/components/forms/size-form';
import prismadb from '@/lib/prismadb';
import { WithParams } from '@/lib/types';

export default async function SizePage({
  params
}: Readonly<WithParams>) {
  const { storeId, sizeId } = await params;
  // console.log(storeId, sizeId);

  const size = await prismadb.size.findUnique({
    where: {
      id: sizeId,
      storeId
    }
  });

  return (
    <>
      <p>Name: {size?.name || 'New?'}</p>
      <p>storeId: {storeId}</p>
      <p>sizeId: {sizeId}</p>
      <SizeForm size={size} />
    </>
  );
}
