// ---- List query params (matches API baseCRUD) ----
export type ListQueryParams = {
  keyword?: string;
  filterOptions?: string; // AND, pipe-delimited: "status;active|campaign;abc123"
  includeOptions?: string; // OR, pipe-delimited
  sortOptions?: string; // semicolon-delimited in your API: "-createdAt;name"
  pageNumber?: number;
  pageLimit?: number;
};

export type ApiListResponse<T> = {
  success: boolean;
  payload: T[];
  metadata?: {
    page: number;
    pages: number;
    totalCount: number;
    prevPage: number;
    nextPage: number;
  };
};
