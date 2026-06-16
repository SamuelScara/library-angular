import { NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppUser, Role } from '../../../core/models/user.model';
import { LinkEntityDialogComponent } from '../link-entity-dialog/link-entity-dialog.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgFor,
    MatToolbarModule,
    MatTableModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css',
})
export class UserManagementComponent implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  users: AppUser[] = [];
  columns = ['id', 'username', 'role', 'actions'];
  roles: Role[] = ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_AUTHOR', 'ROLE_DIRECTOR'];

  selectedRole = new Map<number, Role>();

  ngOnInit() {
    this.load();
  }

  load() {
    this.http.get<AppUser[]>('/api/users').subscribe((users) => {
      this.users = users;
      users.forEach((u) => this.selectedRole.set(u.id, u.role));
      this.cdr.markForCheck();
    });
  }

  save(user: AppUser) {
    const role = this.selectedRole.get(user.id)!;
    this.http
      .put<AppUser>(`/api/users/${user.id}/role`, null, { params: { role } })
      .subscribe((updated) => (user.role = updated.role));
  }

  openLinkDialog(user: AppUser): void {
    this.dialog
      .open(LinkEntityDialogComponent, { data: user, width: '400px' })
      .afterClosed()
      .subscribe((result) => {
        if (result === undefined) return;
        const params: Record<string, number> = {};
        if (result.authorId) params['authorId'] = result.authorId;
        if (result.directorId) params['directorId'] = result.directorId;
        this.http.put<AppUser>(`/api/users/${user.id}/link`, null, { params }).subscribe({
          next: () => {
            this.snackBar.open('Entity linked', 'OK', { duration: 3000 });
            this.load();
          },
        });
      });
  }
}
