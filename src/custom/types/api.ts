export interface PayloadGetApi<T> {
  docs: T[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  nextPage: number | null;
  page: number;
  pagingCounter: number;
  prevPage: number | null;
  totalDocs: number;
  totalPages: number;
}

export interface PayloadPostApi<T> {
  message: string;
  doc: T;
}

export interface PayloadFormOnSuccess<T = any> {
  docs: T[];
  errors: any[];
  message: string;
}
