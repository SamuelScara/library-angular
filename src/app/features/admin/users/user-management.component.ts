import { NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppUser, Role } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [NgFor, MatToolbarModule, MatTableModule, MatSelectModule, MatButtonModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css',
})
export class UserManagementComponent implements OnInit {
  private http = inject(HttpClient);

  users: AppUser[] = [];
  columns = ['id', 'username', 'role', 'actions'];
  roles: Role[] = ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_AUTHOR', 'ROLE_DIRECTOR'];

  selectedRole = new Map<number, Role>();

  ngOnInit() {
    this.load();
  }

  load() {
    this.http.get<AppUser[]>('/api/users').subscribe(users => {
      this.users = users;
      users.forEach(u => this.selectedRole.set(u.id, u.role));
    });
  }

  save(user: AppUser) {
    const role = this.selectedRole.get(user.id)!;
    this.http
      .put<AppUser>(`/api/users/${user.id}/role`, null, { params: { role } })
      .subscribe(updated => (user.role = updated.role));
  }
}
