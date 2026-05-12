import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Author } from '../../../core/models/author.model';
import { AuthorService } from '../../../core/services/author.service';
import { AssignBookDialogComponent } from '../assign-book-dialog/assign-book-dialog.component';
import { AuthorBooksDialogComponent } from '../author-books-dialog/author-books-dialog.component';
import { AuthorFormComponent } from '../author-form/author-form.component';

@Component({
  selector: 'app-author-list-component',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatToolbarModule],
  templateUrl: './author-list.component.html',
  styleUrl: './author-list.component.css',
})
export class AuthorListComponent implements OnInit {
  private authorService = inject(AuthorService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  authors: Author[] = [];
  columns = ['firstName', 'lastName', 'nationality', 'actions'];

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.authorService.getAll().subscribe((data) => {
      this.authors = data;
      this.cdr.detectChanges();
    });
  }

  openForm() {
    this.dialog
      .open(AuthorFormComponent)
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.authorService.create(result).subscribe({
            next: () => {
              this.load();
              this.snackBar.open('Author saved', 'OK', { duration: 3000 });
            },
          });
        }
      });
  }

  openEditForm(author: Author) {
    this.dialog
      .open(AuthorFormComponent, { data: author })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.authorService.update(author.id, result).subscribe({
            next: () => {
              this.load();
              this.snackBar.open('Author has been edited', 'OK', { duration: 3000 });
            },
          });
        }
      });
  }

  openBooksDialog(author: Author) {
    this.dialog.open(AuthorBooksDialogComponent, { data: author, width: '600px' });
  }

  openAssignBooksDialog(author: Author) {
    this.dialog
      .open(AssignBookDialogComponent, { data: author })
      .afterClosed()
      .subscribe((changed) => {
        if (changed) this.load();
      });
  }

  delete(id: number) {
    this.authorService.delete(id).subscribe({
      next: () => {
        this.load();
        this.snackBar.open('Author deleted', 'OK', { duration: 3000 });
      },
    });
  }
}
