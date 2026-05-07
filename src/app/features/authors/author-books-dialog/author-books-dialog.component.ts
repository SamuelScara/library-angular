import { NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { Author } from '../../../core/models/author.model';
import { Book } from '../../../core/models/book.model';
import { AuthorService } from '../../../core/services/author.service';

@Component({
  selector: 'app-author-books-dialog',
  standalone: true,
  imports: [MatDialogModule, MatTableModule, MatButtonModule, NgIf],
  templateUrl: './author-books-dialog.component.html',
  styleUrl: './author-books-dialog.component.css',
})
export class AuthorBooksDialogComponent implements OnInit {
  author: Author = inject(MAT_DIALOG_DATA);
  private authorService = inject(AuthorService);
  private cdr = inject(ChangeDetectorRef);

  books: Book[] = [];
  columns = ['title', 'isbn', 'pubYear', 'availability'];

  ngOnInit(): void {
    this.authorService.getBooks(this.author.id).subscribe((books) => {
      this.books = books;
      this.cdr.detectChanges();
    });
  }
}
