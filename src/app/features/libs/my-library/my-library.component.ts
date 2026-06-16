import { NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Book } from '../../../core/models/book.model';
import { Lib } from '../../../core/models/lib.model';
import { AuthService } from '../../../core/services/auth.service';
import { BookService } from '../../../core/services/book.service';
import { DirectorService } from '../../../core/services/director.service';
import { LibService } from '../../../core/services/lib.service';
import { AssignBooksDialogComponent } from '../assign-books-dialog/assign-books-dialog.component';
import { BookInfoDialogComponent } from '../../books/book-info-dialog/book-info-dialog.component';

@Component({
  selector: 'app-my-library',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    MatIconModule,
    MatListModule,
    MatAccordion,
    MatButtonModule,
    MatExpansionModule,
    MatToolbarModule,
  ],
  templateUrl: './my-library.component.html',
  styleUrl: './my-library.component.css',
})
export class MyLibraryComponent implements OnInit {
  private authService = inject(AuthService);
  private directorService = inject(DirectorService);
  private bookService = inject(BookService);
  private libService = inject(LibService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  lib: Lib | null = null;
  notAssigned = false;

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    const id = this.authService.currentUser$.value?.linkedDirectorId;
    if (!id) {
      this.notAssigned = true;
      return;
    }
    this.directorService.getLib(id).subscribe({
      next: (l) => (this.lib = l),
      error: () => (this.notAssigned = true),
    });
  }

  openAssignBooksDialog(): void {
    if (!this.lib) return;
    this.dialog
      .open(AssignBooksDialogComponent, { data: this.lib, width: '500px' })
      .afterClosed()
      .subscribe(() => this.load());
  }

  openBookInfoDialog(book: Book): void {
    this.bookService.getById(book.id).subscribe({
      next: (b) => this.dialog.open(BookInfoDialogComponent, { data: b, width: '600px' }),
    });
  }

  unassignBook(bookId: number): void {
    if (!this.lib) return;
    this.libService.unassignBook(this.lib.id, bookId).subscribe({
      next: () => {
        this.lib!.books = this.lib!.books.filter((b) => b.id !== bookId);
        this.snackBar.open('Book unassigned', 'OK', { duration: 3000 });
      },
    });
  }
}
