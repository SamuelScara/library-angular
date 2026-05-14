import { Routes } from '@angular/router';
import { AuthorListComponent } from './features/authors/author-list/author-list.component';
import { BookListComponent } from './features/books/book-list/book-list.component';
import { DirectorsListComponent } from './features/directors/directors-list/directors-list.component';
import { ExhibitionListComponent } from './features/exhibitions/exhibition-list/exhibition-list.component';
import { LibListComponent } from './features/libs/lib-list/lib-list.component';
import { StatisticListComponent } from './features/statistics/statistic-list/statistic-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'libs', pathMatch: 'full' },
  { path: 'libs', component: LibListComponent },
  { path: 'directors', component: DirectorsListComponent },
  { path: 'books', component: BookListComponent },
  { path: 'authors', component: AuthorListComponent },
  { path: 'exhibitions', component: ExhibitionListComponent },
  { path: 'statistics', component: StatisticListComponent },
];
