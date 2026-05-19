import { Author } from './author.model';

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface BookFilters {
  yearFrom?: number | null;
  yearTo?: number | null;
  availability?: boolean | null;
  authorName?: string;
}

export interface BookStats {
  bookId: number;
  bookTitle: string;
  totalRuns: number;
  avgVisitors: number;
  avgPosition: number;
  bestPosition: number;
  firstPlaceCount: number;
}

export interface Book {
  id: number;
  title: string;
  isbn: string;
  pubYear: number;
  availability: boolean;
  authors: Author[];
}
