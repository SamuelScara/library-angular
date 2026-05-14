import { Author } from './author.model';

export interface BookFilters {
  yearFrom?: number | null;
  yearTo?: number | null;
  availability?: boolean | null;
  authorName?: string;
}
export interface Book {
  id: number;
  title: string;
  isbn: string;
  pubYear: number;
  availability: boolean;
  authors: Author[];
}
