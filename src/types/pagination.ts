

export interface PaginationParams {

  page: number;

  pageSize: number;
}

export interface PaginationResponse<T> {

  data: T[];

  total: number;

  hasMore: boolean;
}

export interface DataListRef {

  reloadData: () => void;
}

