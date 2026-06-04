export interface Review {
  id: number;
  username: string;
  bookId: number;
  rating: number;
  text: string;
  createdAt: string;
}

export interface ReviewRequest {
  bookId: number;
  rating: number;
  text: string;
}
