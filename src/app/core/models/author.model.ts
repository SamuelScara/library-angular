export interface BookSummary {
  id: number;
  title: string;
  isbn: string;
  pubYear: number;
}

export interface AuthorFilters {
  name?: string;
  nationality?: string;
}

export interface Author {
  id: number;
  firstName: string;
  lastName: string;
  nationality: string;
  books: BookSummary[];
}
