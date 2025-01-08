"use client";

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ColorColumn = {
  id: string;
  name: string;
  value: string;
  createdAt: string;
}

export const columns: ColumnDef<ColorColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'value',
    header: 'Value',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 rounded-full border"
          style={{ backgroundColor: row.original.value }}
        />
        {row.original.value}
      </div>
    )
  },
  {
    accessorKey: 'createdAt',
    header: 'Date Created',
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  }
];
