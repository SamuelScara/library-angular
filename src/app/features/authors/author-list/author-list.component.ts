import { NgFor } from '@angular/common';
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
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Author, AuthorFilters } from '../../../core/models/author.model';
import { AuthorService } from '../../../core/services/author.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AssignBookDialogComponent } from '../assign-book-dialog/assign-book-dialog.component';
import { AuthorBooksDialogComponent } from '../author-books-dialog/author-books-dialog.component';
import { AuthorFormComponent } from '../author-form/author-form.component';

@Component({
  selector: 'app-author-list-component',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgFor,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
  ],
  templateUrl: './author-list.component.html',
  styleUrl: './author-list.component.css',
})
export class AuthorListComponent implements OnInit {
  private authorService = inject(AuthorService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  authors: Author[] = [];
  nationalities: string[] = [];
  columns = ['firstName', 'lastName', 'nationality', 'actions'];
  authorSearch = new FormControl('');
  nationalityFilter = new FormControl('');

  currentPage = 0;
  pageSize = 20;
  totalElements = 0;

  ngOnInit(): void {
    this.authorService.getNationalities().subscribe((n) => {
      this.nationalities = n;
      this.cdr.detectChanges();
    });
    this.load();
    this.authorSearch.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => {
      this.currentPage = 0;
      this.load();
    });
    this.nationalityFilter.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => {
      this.currentPage = 0;
      this.load();
    });
  }

  load() {
    const filters: AuthorFilters = {
      name: this.authorSearch.value ?? '',
      nationality: this.nationalityFilter.value ?? '',
    };
    this.authorService.getAll(filters, this.currentPage, this.pageSize).subscribe((data) => {
      this.authors = data.content;
      this.totalElements = data.totalElements;
      this.cdr.detectChanges();
    });
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.load();
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
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          message: 'Are you sure you want to delete this author? This action cannot be undone.',
        },
        width: '380px',
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.authorService.delete(id).subscribe({
          next: () => {
            this.load();
            this.snackBar.open('Author deleted', 'OK', { duration: 3000 });
          },
        });
      });
  }
}
