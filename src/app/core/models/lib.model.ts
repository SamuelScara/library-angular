import { Book } from './book.model';
import { Director } from './director.model';

export interface Lib {
  id: number;
  name: string;
  city: string;
  address: string;
  director?: Director | null;
  books: Book[];
}
