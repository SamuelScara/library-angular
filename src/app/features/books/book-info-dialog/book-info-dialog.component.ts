import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { Book } from '../../../core/models/book.model';

@Component({
  selector: 'app-book-info-dialog.component',
  standalone: true,
  imports: [MatDialogModule, MatTableModule, MatButtonModule],
  templateUrl: './book-info-dialog.component.html',
  styleUrl: './book-info-dialog.component.css',
})
export class BookInfoDialogComponent {
  result: Book = inject(MAT_DIALOG_DATA);
  columns = ['title', 'isbn', 'pubYear', 'authors'];
}
