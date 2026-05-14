import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { Book } from '../../../core/models/book.model';
import { Exhibition } from '../../../core/models/exhibition.model';
import { Lib } from '../../../core/models/lib.model';
import { LibService } from '../../../core/services/lib.service';

@Component({
  selector: 'app-exhibition-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatSelectModule,
    MatCheckboxModule,
    NgFor,
    NgIf,
  ],
  templateUrl: './exhibition-form.component.html',
  styleUrl: './exhibition-form.component.css',
})
export class ExhibitionFormComponent implements OnInit {
  dialogRef = inject(MatDialogRef<ExhibitionFormComponent>);
  private fb = inject(FormBuilder);
  private libService = inject(LibService);
  private cdr = inject(ChangeDetectorRef);

  data: Exhibition | null = inject(MAT_DIALOG_DATA, { optional: true });

  libs: Lib[] = [];
  booksForLib: Book[] = [];
  selectBookIds: number[] = [...(this.data?.bookIds ?? [])];

  form = this.fb.group({
    title: [this.data?.title ?? '', Validators.required],
    libId: [this.data?.libId ?? (null as number | null), Validators.required],
    startDate: [this.data?.startDate ?? '', Validators.required],
    endDate: [this.data?.endDate ?? '', Validators.required],
    plannedSimulationDate: [this.data?.plannedSimulationDate ?? '', Validators.required],
  });

  get isEdit(): boolean {
    return !!this.data;
  }

  get allSelected(): boolean {
    return this.booksForLib.length > 0 && this.selectBookIds.length === this.booksForLib.length;
  }

  get partiallySelected(): boolean {
    return this.selectBookIds.length > 0 && this.selectBookIds.length < this.booksForLib.length;
  }

  ngOnInit(): void {
    this.libService.getAll().subscribe((libs) => {
      this.libs = libs;
      if (this.data?.libId) {
        const lib = libs.find((l) => l.id === this.data!.libId);
        this.booksForLib = lib?.books ?? [];
      }
      this.cdr.detectChanges();
    });

    this.form.get('libId')!.valueChanges.subscribe((libId) => {
      const lib = this.libs.find((l) => l.id === libId);
      this.booksForLib = lib?.books ?? [];
      this.selectBookIds = [];
    });
  }

  selectAll(): void {
    this.selectBookIds = this.booksForLib.map((b) => b.id);
  }

  deselectAll(): void {
    this.selectBookIds = [];
  }

  toggleBook(bookId: number): void {
    if (this.selectBookIds.includes(bookId)) {
      this.selectBookIds = this.selectBookIds.filter((id) => id !== bookId);
    } else {
      this.selectBookIds = [...this.selectBookIds, bookId];
    }
  }

  isSelected(bookId: number): boolean {
    return this.selectBookIds.includes(bookId);
  }

  get canSubmit(): boolean {
    return this.form.valid && this.selectBookIds.length > 0;
  }

  submit(): void {
    if (this.canSubmit) {
      this.dialogRef.close({ ...this.form.value, bookIds: this.selectBookIds });
    }
  }
}
