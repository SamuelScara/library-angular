import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Book } from '../../../core/models/book.model';
import { Lib } from '../../../core/models/lib.model';
import { BookService } from '../../../core/services/book.service';
import { DirectorService } from '../../../core/services/director.service';
import { LibService } from '../../../core/services/lib.service';
import { BookInfoDialogComponent } from '../../books/book-info-dialog/book-info-dialog.component';
import { AssignBooksDialogComponent } from '../assign-books-dialog/assign-books-dialog.component';
import { LibFormComponent } from '../lib-form/lib-form.component';
import { LibsDirectorDialogComponent } from '../libs-director-dialog/libs-director-dialog.component';

@Component({
  selector: 'app-lib-list.component',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    NgFor,
    NgIf,
  ],
  templateUrl: './lib-list.component.html',
  styleUrl: './lib-list.component.css',
})
export class LibListComponent implements OnInit {
  private libService = inject(LibService);
  private bookService = inject(BookService);
  private directorService = inject(DirectorService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  libs: Lib[] = [];

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.libService.getAll().subscribe((data) => {
      this.libs = data;
      this.cdr.detectChanges();
    });
  }

  openForm() {
    this.dialog
      .open(LibFormComponent)
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.libService.create(result).subscribe({
            next: () => {
              this.load();
              this.snackBar.open('Library saved', 'OK', { duration: 3000 });
            },
            error: () =>
              this.snackBar.open('An error occured while trying to save', 'OK', { duration: 3000 }),
          });
        }
      });
  }

  openEditForm(lib: Lib) {
    this.dialog
      .open(LibFormComponent, { data: lib })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.libService.update(lib.id, result).subscribe({
            next: () => {
              this.load();
              this.snackBar.open('Library has been edited', 'OK', { duration: 3000 });
            },
            error: () =>
              this.snackBar.open('An error occured while trying to update the library', 'OK', {
                duration: 3000,
              }),
          });
        }
      });
  }

  openAssignBooksDialog(lib: Lib) {
    this.dialog
      .open(AssignBooksDialogComponent, { data: lib, width: '500px' })
      .afterClosed()
      .subscribe(() => this.load());
  }

  openBookInfoDialog(book: Book) {
    this.bookService.getById(book.id).subscribe({
      next: (book) => {
        this.dialog.open(BookInfoDialogComponent, { data: book, width: '600px' });
      },
      error: () => this.snackBar.open('Error retrieving book info', 'OK', { duration: 3000 }),
    });
  }

  openAssignDirectorDialog(lib: Lib) {
    this.dialog
      .open(LibsDirectorDialogComponent, { data: lib, width: '500px' })
      .afterClosed()
      .subscribe((result) => {
        if (result) this.load();
      });
  }

  delete(id: number) {
    this.libService.delete(id).subscribe({
      next: () => {
        this.load();
        this.snackBar.open('Library deleted', 'OK', { duration: 3000 });
      },
      error: () =>
        this.snackBar.open('An error occured while trying to delete', 'OK', { duration: 3000 }),
    });
  }

  unassignBookFromLib(lib: Lib, bookId: number): void {
    this.libService.unassignBook(lib.id, bookId).subscribe({
      next: () => {
        lib.books = lib.books.filter((b) => b.id !== bookId);
        this.cdr.detectChanges();
        this.snackBar.open('Book unassigned', 'OK', { duration: 3000 });
      },
      error: () =>
        this.snackBar.open('An error occurred while trying to unassign the book', 'OK', {
          duration: 3000,
        }),
    });
  }
}
