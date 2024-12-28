'use client';

import Link from 'next/link';
import {
  useParams,
  usePathname,
} from 'next/navigation';
import { WithClassName } from '@/lib/types';
import { cn } from '@/lib/utils';

export const MainNavigation = ({
  className
}: WithClassName) => {
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/${params.storeId}`,
      label: 'Store',
      active: pathname === `/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/settings`,
      label: 'Settings',
      active: pathname === `/${params.storeId}/settings`,
    },
  ];

  console.log('pathname', pathname);

  return (
    <nav className={className}>
      <ul className="flex gap-4 lg:gap-6">
        {routes.map((route) => (
          <li key={route.href}>
            <Link href={route.href} className={cn(
              'tex-sm font-medium transition-colors hover:text-primary',
              route.active ? 'text-black  dark:text-white' : 'text-muted-foreground'
            )}>
              {route.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
