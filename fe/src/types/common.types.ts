export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export interface DateRangeMap {
  [key: string]: {
    startDate: Date | null;
    endDate: Date | null;
  };
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}
