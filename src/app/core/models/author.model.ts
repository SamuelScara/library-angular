export interface BookSummary {
  id: number;
  title: string;
  isbn: string;
  pubYear: number;
}
export interface Author {
  id: number;
  firstName: string;
  lastName: string;
  nationality: string;
  books: BookSummary[];
}
