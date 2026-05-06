import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { forkJoin } from 'rxjs';
import { Book } from '../../../core/models/book.model';
import { BookService } from '../../../core/services/book.service';
import { BookFormComponent } from '../book-form/book-form.component';

@Component({
  selector: 'app-book-list-component',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatToolbarModule],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css',
})
export class BookListComponent implements OnInit {
  private bookService = inject(BookService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  books: Book[] = [];
  columns = ['title', 'isbn', 'pubYear', 'authors', 'availability', 'actions'];

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.bookService.getAll().subscribe((data) => {
      this.books = data;
      this.cdr.markForCheck();
    });
  }

  openForm() {
    this.dialog
      .open(BookFormComponent)
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          const { selectedAuthorIds, ...bookData } = result;
          this.bookService.create(bookData).subscribe({
            next: (created) => {
              const assignments = (selectedAuthorIds ?? []).map((authorId: number) =>
                this.bookService.assignAuthor(created.id, authorId),
              );
              if (assignments.length > 0) {
                forkJoin(assignments).subscribe(() => this.load());
              } else {
                this.load();
              }
              this.snackBar.open('Book saved', 'OK', { duration: 3000 });
            },
            error: () =>
              this.snackBar.open('An error occured while trying to save', 'OK', { duration: 3000 }),
          });
        }
      });
  }

  openEditForm(book: Book) {
    this.dialog
      .open(BookFormComponent, { data: book })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.bookService.update(book.id, result).subscribe({
            next: () => {
              this.load();
              this.snackBar.open('Book has been edited', 'OK', { duration: 3000 });
            },
            error: () =>
              this.snackBar.open('An error occured while trying to update the book', 'OK', {
                duration: 3000,
              }),
          });
        }
      });
  }

  delete(id: number) {
    this.bookService.delete(id).subscribe({
      next: () => {
        this.load();
        this.snackBar.open('Book deleted', 'OK', { duration: 3000 });
      },
      error: () =>
        this.snackBar.open('An error occured while trying to delete', 'OK', { duration: 3000 }),
    });
  }
}
