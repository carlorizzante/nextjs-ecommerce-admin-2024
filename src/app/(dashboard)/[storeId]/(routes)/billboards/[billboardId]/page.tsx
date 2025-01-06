import { BillboardForm } from '@/components/forms/billboard-form';
import prismadb from '@/lib/prismadb';
import { WithParams } from '@/lib/types';

export default async function BillboardPage({
  params
}: Readonly<WithParams>) {
  const { storeId, billboardId } = await params;
  // console.log(storeId, billboardId);

  const billboard = await prismadb.billboard.findUnique({
    where: {
      id: billboardId,
      storeId
    }
  });

  return (
    <>
      {/* <p>Name: {billboard?.name || 'New?'}</p> */}
      {/* <p>storeId: {storeId}</p> */}
      {/* <p>billboardId: {billboardId}</p> */}
      <BillboardForm billboard={billboard} />
    </>
  );
}
