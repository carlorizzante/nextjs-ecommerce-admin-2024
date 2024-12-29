"use client";

import {
  Copy,
  Server,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import {
  Badge,
  BadgeProps,
} from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type ApiAlertProps = {
  title: string;
  description: string;
  variant: 'admin' | 'public';
}

const textMap: Record<ApiAlertProps['variant'], string> = {
  admin: 'Admin',
  public: 'Public',
}

const variantMap: Record<ApiAlertProps['variant'], BadgeProps['variant']> = {
  admin: 'destructive',
  public: 'secondary',
}

export const ApiAlert = ({
  title,
  description,
  variant
}: ApiAlertProps) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(description);
    toast.success('Copied to clipboard!');
  }

  return (
    <Alert className="p-4 pt-2 pr-2">
      <AlertTitle className="flex justify-between items-center gap-2">
        <Server className="w-4 h-4" />
        {title}
        <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
        <Button variant="ghost" size="icon" onClick={handleCopy} className="ml-auto">
          <Copy className="w-4 h-4" />
        </Button>
      </AlertTitle>
      <AlertDescription className="flex justify-between items-center">
        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
          {description}
        </code>
      </AlertDescription>
    </Alert>
  )
}
