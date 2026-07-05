import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
import { UploadService } from '../../../core/services/upload.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MatIconModule, MatButtonModule, MatCardModule, MatInputModule, MatFormFieldModule, MatDividerModule, MatSlideToggleModule],
  template: `
    <div class="settings-page">
      <h1>Account Settings</h1>
      <mat-card>
        <mat-card-header><mat-card-title>Profile Information</mat-card-title></mat-card-header>
        <mat-card-content>
          <div class="avatar-section">
            <div class="avatar-wrapper">
              <img [src]="avatarPreview() || 'assets/images/placeholder.svg'" alt="Avatar" class="avatar-img" (error)="$any($event.target).src='assets/images/placeholder.svg'">
              <button type="button" class="avatar-upload-btn" (click)="avatarInput.click()" [disabled]="uploadingAvatar()">
                <mat-icon>{{ uploadingAvatar() ? 'hourglass_empty' : 'camera_alt' }}</mat-icon>
              </button>
              <input #avatarInput type="file" accept="image/*" hidden (change)="onAvatarSelected($event)">
            </div>
          </div>
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
    .avatar-section { display: flex; justify-content: center; margin-bottom: 24px; }
    .avatar-wrapper { position: relative; width: 120px; height: 120px; border-radius: 50%; overflow: hidden; border: 3px solid var(--border-color); }
    .avatar-img { width: 100%; height: 100%; object-fit: cover; }
    .avatar-upload-btn { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.6); color: white; border: none; padding: 6px; cursor: pointer; display: flex; justify-content: center; transition: background 0.2s; }
    .avatar-upload-btn:hover { background: rgba(0,0,0,0.8); }
    .avatar-upload-btn:disabled { opacity: 0.5; }
    .avatar-upload-btn mat-icon { font-size: 20px; width: 20px; height: 20px; }
  `]
})
export class SettingsComponent {
  auth = inject(AuthService);
  theme = inject(ThemeService);
  fb = inject(FormBuilder);
  snackBar = inject(MatSnackBar);
  uploadService = inject(UploadService);
  avatarPreview = signal('');
  uploadingAvatar = signal(false);
  profileForm: FormGroup = this.fb.group({
    firstName: [this.auth.currentUser()?.firstName || '', Validators.required],
    lastName: [this.auth.currentUser()?.lastName || '', Validators.required],
    email: [this.auth.currentUser()?.email || '', [Validators.required, Validators.email]],
    phone: [this.auth.currentUser()?.phone || '', Validators.required]
  });
  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploadingAvatar.set(true);
    this.uploadService.uploadFile(file).subscribe({
      next: (url) => {
        this.avatarPreview.set(url);
        this.uploadingAvatar.set(false);
        this.auth.updateProfile(
          this.profileForm.value.firstName,
          this.profileForm.value.lastName,
          this.profileForm.value.phone,
          url
        ).then(() => {
          this.snackBar.open('Avatar updated successfully!', 'Close', { duration: 3000 });
        });
      },
      error: (err) => {
        this.snackBar.open('Upload failed: ' + (err.error?.message || err.message), 'Close', { duration: 4000 });
        this.uploadingAvatar.set(false);
      }
    });
    input.value = '';
  }
  updateProfile(): void {
    if (this.profileForm.invalid) {
      this.snackBar.open('Please fill out all required fields.', 'Close', { duration: 3000 });
      return;
    }
    const { firstName, lastName, phone } = this.profileForm.value;
    this.auth.updateProfile(firstName, lastName, phone)
      .then(() => {
        this.snackBar.open('Profile updated successfully!', 'Close', { duration: 3000 });
      })
      .catch((err) => {
        this.snackBar.open(err || 'Failed to update profile.', 'Close', { duration: 4000 });
      });
  }
}
