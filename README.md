# Library Angular — Frontend

Angular application for managing a library system. Provides a UI to browse and administer books, authors, libraries, and exhibitions with visitor simulation.

## Tech Stack

| Technology | Version |
|---|---|
| Angular | 21.2.11 |
| TypeScript | 5.9.2 |
| Angular Material | 21.2.9 |
| RxJS | 7.8.0 |
| Vitest | 4.0.8 |
| Node / npm | >= 20 / 11.x |

## Prerequisites

- Node.js >= 20
- npm >= 11
- Spring Boot backend running on `http://localhost:8080`

## Installation & Running

```bash
npm install
npm start
```

The app is available at `http://localhost:4200`.

All calls to `/api/*` are automatically proxied to the backend at `http://localhost:8080` (configured in `proxy.conf.json`).

## Production Build

```bash
npm run build
```

Output in the `dist/` folder.

## Architecture

```
src/app/
├── core/
│   ├── models/       → TypeScript interfaces (Book, Author, Lib, Exhibition, ...)
│   └── services/     → HTTP services (AuthorService, BookService, LibService, ExhibitionService)
├── features/
│   ├── authors/      → Author list + create/edit form
│   ├── books/        → Book list + form with author management
│   ├── exhibitions/  → Exhibition list + form + simulation result dialog
│   └── libs/         → Library list (accordion) + form + book assignment dialog
├── shared/
│   └── components/
│       └── navbar/   → Navigation bar
├── app.routes.ts     → Route definitions
└── app.config.ts     → Providers (router, httpClient, animations)
```

**Modern Angular patterns:**
- Standalone Components (no NgModules)
- Dependency Injection via `inject()`
- Reactive Forms with `FormBuilder`
- Dialog pattern with `MatDialog`

## Features

### Libraries
- Accordion view showing each library's associated books
- Full CRUD (create, edit, delete)
- Dialog to assign and remove books

### Books
- Table with title, ISBN, year, authors, and availability
- Full CRUD
- Author management: on creation, authors are assigned via `forkJoin` after the book is saved; on edit, assignment is real-time
- Already-assigned books are filtered out to prevent duplicates

### Authors
- Table with first name, last name, and nationality
- Full CRUD

### Exhibitions & Simulations
- Full CRUD for exhibitions with library and book selection
- Visitor simulation: generates a ranking of books by estimated visitor count
- Results displayed in a dialog with position / title / visitors columns

## Routing

| Path | Component | Description |
|---|---|---|
| `/libs` | `LibListComponent` | Home — library list |
| `/books` | `BookListComponent` | Book management |
| `/authors` | `AuthorListComponent` | Author management |
| `/exhibitions` | `ExhibitionListComponent` | Exhibitions and simulations |

## HTTP Services

All services communicate with the backend via `HttpClient`.

| Service | Base URL | Operations |
|---|---|---|
| `AuthorService` | `/api/authors` | Author CRUD |
| `BookService` | `/api/books` | Book CRUD, assign/unassign authors |
| `LibService` | `/api/libs` | Library CRUD, assign/unassign books |
| `ExhibitionService` | `/api/exhibitions` | Exhibition CRUD, simulation |

## Testing

```bash
npm test
```

Run with **Vitest**.

## Branches

| Branch | Status | Description |
|---|---|---|
| `main` | Stable | Core CRUD features |
| `develop` | Active | Integration of completed features |
| `feature/author-features` | Done | Author CRUD |
| `feature/book-features` | Done | Book CRUD with author management |
| `feature/library-features` | Done | Library CRUD |
| `feature/exhibition-features` | Done | Exhibitions and simulations |
| `feature/login-features` | In progress | JWT authentication |
| `feature/interceptors` | In progress | HTTP interceptors for token handling |
| `feature/director-features` | In progress | Director management |
| `feature/statistics-features` | In progress | Statistics dashboard |
