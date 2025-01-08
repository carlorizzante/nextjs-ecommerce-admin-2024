import { ColorForm } from '@/components/forms/color-form';
import prismadb from '@/lib/prismadb';
import { WithParams } from '@/lib/types';

export default async function ColorPage({
  params
}: Readonly<WithParams>) {
  const { storeId, colorId } = await params;
  // console.log(storeId, colorId);

  const color = await prismadb.color.findUnique({
    where: {
      id: colorId,
      storeId
    }
  });

  return (
    <>
      <p>Name: {color?.name || 'New?'}</p>
      <p>storeId: {storeId}</p>
      <p>colorId: {colorId}</p>
      <ColorForm color={color} />
    </>
  );
}
