declare namespace Common {
  export type PagingMetadata = {
    lastCursor: number | null;
    hasMore: boolean;
  };

  export type PagingRes<T> = {
    data: T[];
    metadata: PagingMetadata;
  };
}
