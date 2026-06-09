/*
export const routes: Routes = [
  { path: '', redirectTo: 'libs', pathMatch: 'full' },
  { path: 'libs', component: LibListComponent },
  { path: 'directors', component: DirectorsListComponent },
  { path: 'books', component: BookListComponent },
  { path: 'authors', component: AuthorListComponent },
  { path: 'exhibitions', component: ExhibitionListComponent },
  { path: 'statistics', component: StatisticListComponent },
];
*/
import { Routes } from '@angular/router';
import { adminGuard, authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
  },

  {
    path: 'catalog',
    loadComponent: () =>
      import('./features/user/catalog/catalog.component').then((m) => m.CatalogComponent),
  },
  {
    path: 'books/:id',
    loadComponent: () =>
      import('./features/user/book-detail/book-detail.component').then(
        (m) => m.BookDetailComponent,
      ),
  },

  { path: '', redirectTo: 'catalog', pathMatch: 'full' },

  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'my-reservations',
        loadComponent: () =>
          import('./features/user/my-reservations/my-reservations.component').then(
            (m) => m.MyReservationsComponent,
          ),
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile-info/profile-info.component').then(m => m.ProfileInfoComponent),
      },
    ],
  },

  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: 'authors',
        loadComponent: () =>
          import('./features/authors/author-list/author-list.component').then(
            (m) => m.AuthorListComponent,
          ),
      },
      {
        path: 'books',
        loadComponent: () =>
          import('./features/books/book-list/book-list.component').then((m) => m.BookListComponent),
      },
      {
        path: 'libs',
        loadComponent: () =>
          import('./features/libs/lib-list/lib-list.component').then((m) => m.LibListComponent),
      },
      {
        path: 'directors',
        loadComponent: () =>
          import('./features/directors/directors-list/directors-list.component').then(
            (m) => m.DirectorsListComponent,
          ),
      },
      {
        path: 'exhibitions',
        loadComponent: () =>
          import('./features/exhibitions/exhibition-list/exhibition-list.component').then(
            (m) => m.ExhibitionListComponent,
          ),
      },
      {
        path: 'statistics',
        loadComponent: () =>
          import('./features/statistics/statistic-list/statistic-list.component').then(
            (m) => m.StatisticListComponent,
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/admin/users/user-management.component').then(
            (m) => m.UserManagementComponent,
          ),
      },
      {
        path: 'reservations',
        loadComponent: () =>
          import('./features/admin/reservations/reservations-panel.component').then(
            (m) => m.ReservationsPanelComponent,
          ),
      },
      { path: '', redirectTo: 'authors', pathMatch: 'full' },
    ],
  },

  { path: '**', redirectTo: 'catalog' },
];
