import { Book } from './book.model';

export interface Lib {
  id: number;
  name: string;
  city: string;
  address: string;
  books: Book[];
}
