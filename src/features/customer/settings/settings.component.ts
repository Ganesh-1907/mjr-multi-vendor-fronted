import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatButtonModule, MatCardModule, MatInputModule, MatFormFieldModule, MatDividerModule, MatSlideToggleModule],
  template: `
    <div class="settings-page">
      <h1>Account Settings</h1>
      <mat-card>
        <mat-card-header><mat-card-title>Profile Information</mat-card-title></mat-card-header>
        <mat-card-content>
          <form [formGroup]="profileForm" (ngSubmit)="updateProfile()">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>First Name</mat-label>
                <input matInput formControlName="firstName">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Last Name</mat-label>
                <input matInput formControlName="lastName">
              </mat-form-field>
            </div>
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" readonly>
              <mat-icon matPrefix>email</mat-icon>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Phone Number</mat-label>
              <input matInput formControlName="phone">
              <mat-icon matPrefix>phone</mat-icon>
            </mat-form-field>
            <button mat-raised-button color="primary" type="submit">Save Changes</button>
          </form>
        </mat-card-content>
      </mat-card>
      <mat-card>
        <mat-card-header><mat-card-title>Password</mat-card-title></mat-card-header>
        <mat-card-content>
          <button mat-stroked-button routerLink="/auth/forgot-password">Change Password</button>
        </mat-card-content>
      </mat-card>
      <mat-card>
        <mat-card-header><mat-card-title>Preferences</mat-card-title></mat-card-header>
        <mat-card-content>
          <div class="preference-item">
            <span>Dark Mode</span>
            <mat-slide-toggle [checked]="theme.isDarkMode()" (change)="theme.toggleTheme()"></mat-slide-toggle>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .settings-page { max-width: 800px; margin: 0 auto; }
    h1 { margin-bottom: 24px; }
    mat-card { margin-bottom: 16px; }
    mat-card-content { padding: 16px !important; }
    form { display: flex; flex-direction: column; gap: 16px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .mat-mdc-form-field { width: 100%; }
    .preference-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; }
    @media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } }
  `]
})
export class SettingsComponent {
  auth = inject(AuthService);
  theme = inject(ThemeService);
  fb = inject(FormBuilder);
  snackBar = inject(MatSnackBar);
  profileForm: FormGroup = this.fb.group({
    firstName: [this.auth.currentUser()?.firstName || '', Validators.required],
    lastName: [this.auth.currentUser()?.lastName || '', Validators.required],
    email: [this.auth.currentUser()?.email || '', [Validators.required, Validators.email]],
    phone: [this.auth.currentUser()?.phone || '', Validators.required]
  });
  updateProfile(): void {
    this.snackBar.open('Profile updated successfully!', 'Close', { duration: 3000 });
  }
}
