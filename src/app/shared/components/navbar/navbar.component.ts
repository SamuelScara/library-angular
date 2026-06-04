import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-navbar-component',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, RouterLink, RouterLinkActive, NgIf, AsyncPipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  protected auth = inject(AuthService);
  private dialog = inject(MatDialog);

  confirmLogout(): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Logout', message: 'Are you sure you want to log out?', confirmLabel: 'Logout' }
    });
    ref.afterClosed().subscribe(confirmed => { if (confirmed) this.auth.logout(); });
  }
}
