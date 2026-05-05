import { Routes } from '@angular/router';
import { BookListComponent } from './features/books/book-list/book-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'books', pathMatch: 'full' },
  { path: 'books', component: BookListComponent },
];
