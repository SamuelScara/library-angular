import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Book, BookFilters } from '../../../core/models/book.model';
import { BookService } from '../../../core/services/book.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { StatisticDialogComponent } from '../../statistics/statistic-dialog/statistic-dialog.component';
import { AssignAuthorDialogComponent } from '../assign-author-dialog/assign-author-dialog.component';
import { BookFilterDialogComponent } from '../book-filter-dialog/book-filter-dialog.component';
import { BookFormComponent } from '../book-form/book-form.component';

@Component({
  selector: 'app-book-list-component',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css',
})
export class BookListComponent implements OnInit {
  private bookService = inject(BookService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  books: Book[] = [];
  activeFilters: BookFilters = {};
  columns = ['title', 'isbn', 'pubYear', 'authors', 'availability', 'actions'];
  search = new FormControl('');

  get activeFilterCount(): number {
    const f = this.activeFilters;
    return [f.yearFrom, f.yearTo, f.availability, f.authorName?.trim()].filter(
      (v) => v != null && v !== '',
    ).length;
  }

  get filteredBooks(): Book[] {
    const q = (this.search.value ?? '').toLowerCase().trim();
    if (!q) return this.books;
    return this.books.filter((b) => {
      const authors = (b.authors ?? []).map((a) => `${a.firstName} ${a.lastName}`).join(' ');
      return (
        b.title.toLowerCase().includes(q) ||
        b.isbn.toLowerCase().includes(q) ||
        String(b.pubYear).includes(q) ||
        String(b.availability ?? '')
          .toLowerCase()
          .includes(q) ||
        authors.toLowerCase().includes(q)
      );
    });
  }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.bookService.getAll(this.activeFilters).subscribe((data) => {
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
          this.bookService.create(result).subscribe({
            next: () => {
              this.load();
              this.snackBar.open('Book saved', 'OK', { duration: 3000 });
            },
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
          });
        }
      });
  }

  openFilterDialog() {
    this.dialog
      .open(BookFilterDialogComponent, { data: this.activeFilters, width: '300px' })
      .afterClosed()
      .subscribe((result) => {
        if (result === undefined) return; // cancel
        this.activeFilters = result;
        this.load();
      });
  }

  openStatisticDialog(book: Book) {
    this.dialog.open(StatisticDialogComponent, { data: book, width: '340px' });
  }

  openAssignAuthorDialog(book: Book) {
    this.dialog
      .open(AssignAuthorDialogComponent, { data: book })
      .afterClosed()
      .subscribe((changed) => {
        if (changed) this.load();
      });
  }

  delete(id: number) {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          message: 'Are you sure you want to delete this book? This action cannot be undone.',
        },
        width: '380px',
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.bookService.delete(id).subscribe({
          next: () => {
            this.load();
            this.snackBar.open('Book deleted', 'OK', { duration: 3000 });
          },
        });
      });
  }
}
