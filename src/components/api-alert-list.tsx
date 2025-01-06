import { useParams } from 'next/navigation';
import { useOrigin } from '@/hooks';
import { WithClassName } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ApiAlert } from './api-alert';

type ApiAlertListProps = WithClassName & {
  entityName: string;
  entityIdName: string;
}

export const ApiAlertList = ({
  className,
  entityName,
  entityIdName
}: ApiAlertListProps) => {
  const params = useParams();
  const origin = useOrigin();

  const baseUrl = `${origin}/api/${params.storeId}`;

  return (
    <div className={cn('space-y-4', className)}>
      <ApiAlert
        title="GET"
        variant="public"
        description={`${baseUrl}/${entityName}`}
      />
      <ApiAlert
        title="GET"
        variant="public"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
      />
      <ApiAlert
        title="POST"
        variant="admin"
        description={`${baseUrl}/${entityName}`}
      />
      <ApiAlert
        title="PATCH"
        variant="admin"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
      />
      <ApiAlert
        title="DELETE"
        variant="admin"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
      />
    </div>
  );
}
