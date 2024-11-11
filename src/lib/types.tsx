export type WithChildren = React.PropsWithChildren;

export type WithId = { id: string; }

export type WithClassName = {
  className?: string;
}

export type WithParams = {
  params: Record<string, string>;
}

export type WithPagination = {
  page?: number;
  take?: number;
}
