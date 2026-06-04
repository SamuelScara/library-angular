import { NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Book } from '../../../core/models/book.model';
import { ReservationRequest } from '../../../core/models/reservation.model';
import { Review, ReviewRequest } from '../../../core/models/review.model';
import { BookService } from '../../../core/services/book.service';
import { ReservationService } from '../../../core/services/reservation.service';
import { ReviewService } from '../../../core/services/review.service';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    ReactiveFormsModule,
    RouterLink,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
  ],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.css',
})
export class BookDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private bookService = inject(BookService);
  private reservationService = inject(ReservationService);
  private reviewService = inject(ReviewService);
  private snackBar = inject(MatSnackBar);

  book: Book | null = null;
  reviews: Review[] = [];

  reservationForm = new FormGroup({
    dateFrom: new FormControl('', Validators.required),
    dateTo: new FormControl('', Validators.required),
  });

  reviewForm = new FormGroup({
    rating: new FormControl<number>(5, [Validators.required, Validators.min(1), Validators.max(5)]),
    text: new FormControl(''),
  });

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.bookService.getById(id).subscribe(b => (this.book = b));
    this.reviewService.getByBook(id).subscribe(r => (this.reviews = r));
  }

  reserve() {
    if (this.reservationForm.invalid || !this.book) return;
    const req: ReservationRequest = {
      bookId: this.book.id,
      dateFrom: this.reservationForm.value.dateFrom!,
      dateTo: this.reservationForm.value.dateTo!,
    };
    this.reservationService.create(req).subscribe({
      next: () => {
        this.snackBar.open('Reservation submitted!', 'Close', { duration: 3000 });
        this.reservationForm.reset();
      },
      error: () => this.snackBar.open('Reservation failed.', 'Close', { duration: 3000 }),
    });
  }

  submitReview() {
    if (this.reviewForm.invalid || !this.book) return;
    const req: ReviewRequest = {
      bookId: this.book.id,
      rating: this.reviewForm.value.rating!,
      text: this.reviewForm.value.text ?? '',
    };
    this.reviewService.create(req).subscribe({
      next: r => {
        this.reviews = [...this.reviews, r];
        this.reviewForm.reset({ rating: 5 });
        this.snackBar.open('Review saved!', 'Close', { duration: 3000 });
      },
      error: err => {
        const msg =
          err.status === 409
            ? 'You have already reviewed this book.'
            : 'Failed to save review.';
        this.snackBar.open(msg, 'Close', { duration: 3000 });
      },
    });
  }
}
