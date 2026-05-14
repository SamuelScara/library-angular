import { DecimalPipe, NgIf } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BookStats } from '../../../core/models/book.model';
import { BookService } from '../../../core/services/book.service';

@Component({
  selector: 'app-statistic-list.component',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatProgressSpinnerModule,
    NgIf,
    DecimalPipe,
  ],
  templateUrl: './statistic-list.component.html',
  styleUrl: './statistic-list.component.css',
})
export class StatisticListComponent implements OnInit, AfterViewInit {
  private bookService = inject(BookService);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<BookStats>();
  columns = [
    'bookTitle',
    'totalRuns',
    'avgVisitors',
    'avgPosition',
    'bestPosition',
    'firstPlaceCount',
  ];
  loading = true;

  totalBooks = 0;
  overallAvgVisitors = 0;
  mostRunBook: BookStats | null = null;
  bestPositionedBook: BookStats | null = null;

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.bookService.getAllBooksStats().subscribe((data) => {
      this.dataSource.data = data;
      this.totalBooks = data.length;
      this.overallAvgVisitors = Math.round(
        data.reduce((s, b) => s + b.avgVisitors, 0) / data.length,
      );
      this.mostRunBook = data.reduce((a, b) => (a.totalRuns > b.totalRuns ? a : b), data[0]);
      this.bestPositionedBook = data.reduce(
        (a, b) => (a.bestPosition < b.bestPosition ? a : b),
        data[0],
      );
      this.loading = false;
      this.cdr.markForCheck();
    });
  }
}
