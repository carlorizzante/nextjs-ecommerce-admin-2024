"use client";

import {
  useEffect,
  useState,
} from 'react';
import {
  ImagePlus,
  Trash,
} from 'lucide-react';
import {
  CldUploadWidget,
  type CldUploadWidgetProps,
} from 'next-cloudinary';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { WithClassName } from '@/lib/types';

type ImageUploaderProps = WithClassName & {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  // onChange: (file: File) => void;
  // onRemove: (file: File) => void;
  value?: string[];
}

export const ImageUploader = ({
  disabled,
  onChange,
  onRemove,
  value = [],
}: ImageUploaderProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleUpload = (result: { info: { secure_url: string; }; }) => {
    console.log('ImageUploader > handleUpload', result);
    onChange(result.info.secure_url);
  }

  // const handleUploadWithFileType = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = event.target.files;
  //   if (!files || !files.length) {
  //     return;
  //   }

  //   const file = files[0];
  //   console.log('ImageUploader > handleUpload', file);
  // }

  if (!isMounted) {
    return null;
  }

  console.log('ImageUploader > value', value);
  console.log('ImageUploader > typeof value', typeof value);
  console.log('ImageUploader > value.length', value.length);

  return (
    <>
      <div className="flex items-center gap-4 mb-4">
        {value.map((url) => url ? (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="absolute top-2 right-2 z-10">
              <Button
                variant="destructive"
                size="icon"
                onClick={() => onRemove(url)}
                type="button"
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
            <Image
              src={url}
              alt=""
              className="object-cover"
              fill
            />
          </div>
        ) : null)}
      </div>
      <CldUploadWidget onSuccess={handleUpload as CldUploadWidgetProps['onSuccess']} uploadPreset="next-ecommerce-2024">
        {({ open }) => {
          const onClick = () => {
            open();
          }
          return (
            <Button
              variant="outline"
              onClick={onClick}
              disabled={disabled}>
              <ImagePlus className="w-4 h-4" />
              Upload an Image
            </Button>
          )
        }}
      </CldUploadWidget>
    </>
  );
}
