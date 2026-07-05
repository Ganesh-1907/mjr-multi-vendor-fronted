import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ApiDataService } from '../../../core/services/api-data.service';
import { UploadService } from '../../../core/services/upload.service';

@Component({
  selector: 'app-vendor-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatButtonModule, MatCardModule, MatInputModule, MatFormFieldModule],
  template: `
    <div class="settings-page">
      <h1>Vendor Settings</h1>
      <mat-card>
        <mat-card-header><mat-card-title>Store Branding</mat-card-title></mat-card-header>
        <mat-card-content>
          <div class="branding-grid">
            <div class="branding-item">
              <label>Store Logo</label>
              <div class="branding-preview">
                <img [src]="storeLogoPreview() || 'assets/images/placeholder.svg'" alt="Logo" (error)="$any($event.target).src='assets/images/placeholder.svg'">
              </div>
              <button type="button" class="upload-btn" (click)="logoInput.click()" [disabled]="uploadingLogo()">
                <mat-icon>{{ uploadingLogo() ? 'hourglass_empty' : 'cloud_upload' }}</mat-icon>
                {{ uploadingLogo() ? 'Uploading...' : 'Upload Logo' }}
              </button>
              <input #logoInput type="file" accept="image/*" hidden (change)="onLogoSelected($event)">
            </div>
            <div class="branding-item">
              <label>Store Banner</label>
              <div class="branding-preview banner">
                <img [src]="storeBannerPreview() || 'assets/images/placeholder.svg'" alt="Banner" (error)="$any($event.target).src='assets/images/placeholder.svg'">
              </div>
              <button type="button" class="upload-btn" (click)="bannerInput.click()" [disabled]="uploadingBanner()">
                <mat-icon>{{ uploadingBanner() ? 'hourglass_empty' : 'cloud_upload' }}</mat-icon>
                {{ uploadingBanner() ? 'Uploading...' : 'Upload Banner' }}
              </button>
              <input #bannerInput type="file" accept="image/*" hidden (change)="onBannerSelected($event)">
            </div>
          </div>
        </mat-card-content>
      </mat-card>
      <mat-card>
        <mat-card-header><mat-card-title>Profile Settings</mat-card-title></mat-card-header>
        <mat-card-content>
          <form [formGroup]="settingsForm" (ngSubmit)="saveSettings()">
            <div class="form-row">
              <mat-form-field appearance="outline"><mat-label>First Name</mat-label>
                <input matInput formControlName="firstName"><mat-icon matPrefix>person</mat-icon>
              </mat-form-field>
              <mat-form-field appearance="outline"><mat-label>Last Name</mat-label>
                <input matInput formControlName="lastName">
              </mat-form-field>
            </div>
            <mat-form-field appearance="outline"><mat-label>Email</mat-label>
              <input matInput formControlName="email" readonly><mat-icon matPrefix>email</mat-icon>
            </mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Phone</mat-label>
              <input matInput formControlName="phone"><mat-icon matPrefix>phone</mat-icon>
            </mat-form-field>
            <button mat-raised-button color="primary" type="submit">Save Changes</button>
          </form>
        </mat-card-content>
      </mat-card>
      <mat-card>
        <mat-card-header><mat-card-title>Danger Zone</mat-card-title></mat-card-header>
        <mat-card-content>
          <button mat-stroked-button color="warn"><mat-icon>logout</mat-icon> Logout</button>
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
    @media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } }
    .branding-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .branding-item { display: flex; flex-direction: column; gap: 8px; align-items: center; }
    .branding-item label { font-weight: 600; color: var(--text-secondary); font-size: 13px; align-self: flex-start; }
    .branding-preview { width: 100%; height: 120px; border-radius: var(--radius-md); overflow: hidden; background: var(--bg-tertiary); border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: center; }
    .branding-preview.banner { height: 80px; }
    .branding-preview img { width: 100%; height: 100%; object-fit: contain; }
    .upload-btn { display: flex; align-items: center; gap: 4px; padding: 8px 16px; background: var(--primary); color: white; border: none; border-radius: var(--radius-sm); cursor: pointer; font-size: 13px; font-weight: 600; transition: opacity 0.2s; }
    .upload-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .upload-btn:hover:not(:disabled) { opacity: 0.9; }
    .upload-btn mat-icon { font-size: 18px; width: 18px; height: 18px; }
    @media (max-width: 600px) { .branding-grid { grid-template-columns: 1fr; } }
  `]
})
export class VendorSettingsComponent {
  auth = inject(AuthService);
  fb = inject(FormBuilder);
  snackBar = inject(MatSnackBar);
  uploadService = inject(UploadService);
  apiData = inject(ApiDataService);

  storeLogoPreview = signal('');
  storeBannerPreview = signal('');
  uploadingLogo = signal(false);
  uploadingBanner = signal(false);

  settingsForm: FormGroup = this.fb.group({
    firstName: [this.auth.currentUser()?.firstName || '', Validators.required],
    lastName: [this.auth.currentUser()?.lastName || '', Validators.required],
    email: [this.auth.currentUser()?.email || '', [Validators.required, Validators.email]],
    phone: [this.auth.currentUser()?.phone || '', Validators.required]
  });

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploadingLogo.set(true);
    this.uploadService.uploadFile(file).subscribe({
      next: (url) => {
        this.storeLogoPreview.set(url);
        this.uploadingLogo.set(false);
        this.apiData.updateProfile({
          firstName: this.settingsForm.value.firstName,
          lastName: this.settingsForm.value.lastName,
          phone: this.settingsForm.value.phone,
          storeLogo: url
        }).subscribe({
          next: () => this.snackBar.open('Logo updated!', 'Close', { duration: 3000 }),
          error: (err) => this.snackBar.open(err.error?.message || 'Failed to update logo', 'Close', { duration: 4000 })
        });
      },
      error: (err) => {
        this.snackBar.open('Upload failed: ' + (err.error?.message || err.message), 'Close', { duration: 4000 });
        this.uploadingLogo.set(false);
      }
    });
    input.value = '';
  }

  onBannerSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploadingBanner.set(true);
    this.uploadService.uploadFile(file).subscribe({
      next: (url) => {
        this.storeBannerPreview.set(url);
        this.uploadingBanner.set(false);
        // Upload banner via profile update with storeBanner
        const body: any = {
          firstName: this.settingsForm.value.firstName,
          lastName: this.settingsForm.value.lastName,
          phone: this.settingsForm.value.phone,
        };
        body.storeBanner = url;
        this.apiData.updateProfile(body).subscribe({
          next: () => this.snackBar.open('Banner updated!', 'Close', { duration: 3000 }),
          error: (err) => this.snackBar.open(err.error?.message || 'Failed', 'Close', { duration: 4000 })
        });
      },
      error: (err) => {
        this.snackBar.open('Upload failed: ' + (err.error?.message || err.message), 'Close', { duration: 4000 });
        this.uploadingBanner.set(false);
      }
    });
    input.value = '';
  }

  saveSettings(): void {
    if (this.settingsForm.invalid) {
      this.snackBar.open('Please fill out all required fields.', 'Close', { duration: 3000 });
      return;
    }
    const { firstName, lastName, phone } = this.settingsForm.value;
    this.auth.updateProfile(firstName, lastName, phone)
      .then(() => {
        this.snackBar.open('Settings saved successfully!', 'Close', { duration: 3000 });
      })
      .catch((err) => {
        this.snackBar.open(err || 'Failed to update settings.', 'Close', { duration: 4000 });
      });
  }
}
