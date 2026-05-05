import { Author } from './author.model';

export interface Book {
  id: number;
  title: string;
  isbn: string;
  pubYear: number;
  availability: boolean;
  authors: Author[];
}
