import { NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { debounceTime } from 'rxjs';
import { Book } from '../../../core/models/book.model';
import { BookService } from '../../../core/services/book.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatPaginatorModule,
  ],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css',
})
export class CatalogComponent implements OnInit {
  private bookService = inject(BookService);

  totalElements = 0;
  pageSize = 20;
  pageIndex = 0;

  books: Book[] = [];
  search = new FormControl('');

  ngOnInit() {
    this.load();
    this.search.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.pageIndex = 0;
      this.load();
    });
  }

  load() {
    this.bookService
      .getAll({ authorName: this.search.value ?? '' }, this.pageIndex, this.pageSize)
      .subscribe((page) => {
        this.books = page.content;
        this.totalElements = page.totalElements;
      });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.load();
  }
}
