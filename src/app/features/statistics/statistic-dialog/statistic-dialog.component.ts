import { DialogRef } from '@angular/cdk/dialog';
import { DecimalPipe, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Book, BookStats } from '../../../core/models/book.model';
import { BookService } from '../../../core/services/book.service';

@Component({
  selector: 'app-statistic-dialog.component',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatProgressSpinnerModule, NgIf, DecimalPipe],
  templateUrl: './statistic-dialog.component.html',
  styleUrl: './statistic-dialog.component.css',
})
export class StatisticDialogComponent implements OnInit {
  private bookService = inject(BookService);
  private dialogRef = inject(DialogRef<StatisticDialogComponent>);
  private cdr = inject(ChangeDetectorRef);
  book: Book = inject(MAT_DIALOG_DATA);

  stats: BookStats | null = null;
  loading = true;

  ngOnInit(): void {
    this.bookService.getBookStats(this.book.id).subscribe({
      next: (s) => {
        this.stats = s;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}
