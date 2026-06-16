import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { Author } from '../../../core/models/author.model';
import { Director } from '../../../core/models/director.model';
import { EntityType, LinkEntityResult } from '../../../core/models/entity.model';
import { AppUser } from '../../../core/models/user.model';
import { AuthorService } from '../../../core/services/author.service';
import { DirectorService } from '../../../core/services/director.service';

@Component({
  selector: 'app-link-entity-dialog.component',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule,
    NgIf,
    NgFor,
  ],
  templateUrl: './link-entity-dialog.component.html',
  styleUrl: './link-entity-dialog.component.css',
})
export class LinkEntityDialogComponent implements OnInit {
  dialogRef = inject(MatDialogRef<LinkEntityDialogComponent>);
  user: AppUser = inject(MAT_DIALOG_DATA);

  private authorService = inject(AuthorService);
  private directorService = inject(DirectorService);
  private cdr = inject(ChangeDetectorRef);

  authors: Author[] = [];
  directors: Director[] = [];
  entityType = new FormControl<EntityType>('NONE');
  selectedAuthorId = new FormControl<number | null>(null);
  selectedDirectorId = new FormControl<number | null>(null);

  ngOnInit(): void {
    this.authorService.getAllList().subscribe((a) => {
      this.authors = a;
      if (this.user.linkedAuthorId) this.selectedAuthorId.setValue(this.user.linkedAuthorId);
      this.cdr.detectChanges();
    });
    this.directorService.getAll().subscribe((d) => {
      this.directors = d;
      if (this.user.linkedDirectorId) this.selectedDirectorId.setValue(this.user.linkedDirectorId);
      this.cdr.detectChanges();
    });

    if (this.user.role === 'ROLE_AUTHOR') this.entityType.setValue('AUTHOR');
    else if (this.user.role === 'ROLE_DIRECTOR') this.entityType.setValue('DIRECTOR');
  }

  get canConfirm(): boolean {
    const type = this.entityType.value;
    if (type === 'AUTHOR') return this.selectedAuthorId.value !== null;
    if (type === 'DIRECTOR') return this.selectedDirectorId.value !== null;
    return true;
  }

  confirm(): void {
    const type = this.entityType.value;
    const result: LinkEntityResult =
      type === 'AUTHOR'
        ? { authorId: this.selectedAuthorId.value, directorId: null }
        : type === 'DIRECTOR'
          ? { authorId: null, directorId: this.selectedDirectorId.value }
          : { authorId: null, directorId: null };
    this.dialogRef.close(result);
  }
}
