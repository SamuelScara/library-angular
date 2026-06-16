import { NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Director } from '../../../core/models/director.model';
import { Lib } from '../../../core/models/lib.model';
import { AuthService } from '../../../core/services/auth.service';
import { DirectorService } from '../../../core/services/director.service';
import { DirectorsFormComponent } from '../../directors/directors-form/directors-form.component';

@Component({
  selector: 'app-profile-director',
  standalone: true,
  imports: [NgIf, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './profile-director.component.html',
  styleUrl: './profile-director.component.css',
})
export class ProfileDirectorComponent implements OnInit {
  private authService = inject(AuthService);
  private directorService = inject(DirectorService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  director: Director | null = null;
  lib: Lib | null = null;

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    const id = this.authService.currentUser$.value?.linkedDirectorId;
    if (!id) return;
    this.directorService.getById(id).subscribe((d) => {
      this.director = d;
      if (d.libId) {
        this.directorService.getLib(id).subscribe((l) => (this.lib = l));
      }
    });
  }

  openEditForm(): void {
    if (!this.director) return;
    this.dialog
      .open(DirectorsFormComponent, { data: this.director })
      .afterClosed()
      .subscribe((result) => {
        if (!result || !this.director) return;
        this.directorService.update(this.director.id, result).subscribe({
          next: (updated) => {
            this.director = updated;
            this.snackBar.open('Profile updated', 'OK', { duration: 3000 });
          },
        });
      });
  }
}
