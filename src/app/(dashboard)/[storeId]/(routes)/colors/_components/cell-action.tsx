import { useState } from 'react';
import axios from 'axios';
import {
  Copy,
  Edit,
  MoreHorizontal,
  Trash,
} from 'lucide-react';
import {
  useParams,
  useRouter,
} from 'next/navigation';
import toast from 'react-hot-toast';
import { AlertModal } from '@/components/modals/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ColorColumn } from './columns';

type CellActionProps = {
  data: ColorColumn;
}

export const CellAction = ({ data }: CellActionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const params = useParams();
  const router = useRouter();
  console.log(data)

  const handleCopy = () => {
    console.log(data.id)
    navigator.clipboard.writeText(data.id);
    toast.success('Color ID copied to clipboard!');
  }

  const handleEdit = () => {
    router.push(`/${params.storeId}/colors/${data.id}`);
  }

  const handleDelete = async () => {
    console.log('ColorForm > handleDelete');
    const successMessage = 'Color deleted!';
    const errorMessage = 'Failed to delete color. Make sure to remove all products used by this color before deleting it.';
    try {
      setIsLoading(true);
      // throw new Error('Not implemented');
      const response = await axios.delete(`/api/${params.storeId}/colors/${data.id}`);
      if (response.status === 200) {
        router.refresh();
        toast.success(successMessage);
      } else {
        toast.error(errorMessage);
      }
    }
    catch (error) {
      console.error('ColorForm > handleDelete', error);
      toast.error(errorMessage);
    }
    finally {
      setOpen(false);
      setIsLoading(false);
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        loading={isLoading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" color="icon">
            <span className="sr-only">Open Menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleCopy}>
            <Copy />
            <span>Copy ID</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEdit}>
            <Edit />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent >
      </DropdownMenu></>
  );
}
