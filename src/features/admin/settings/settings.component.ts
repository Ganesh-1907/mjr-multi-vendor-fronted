import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatButtonModule, MatCardModule, MatSlideToggleModule, MatInputModule, MatFormFieldModule],
  template: `
    <div class="settings-page">
      <h1>Admin Settings</h1>
      <mat-card>
        <mat-card-header><mat-card-title>General Settings</mat-card-title></mat-card-header>
        <mat-card-content>
          <form [formGroup]="settingsForm" (ngSubmit)="saveSettings()">
            <mat-form-field appearance="outline"><mat-label>Site Name</mat-label>
              <input matInput formControlName="siteName">
            </mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Support Email</mat-label>
              <input matInput formControlName="supportEmail">
            </mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Support Phone</mat-label>
              <input matInput formControlName="supportPhone">
            </mat-form-field>
            <button mat-raised-button color="primary" type="submit">Save Settings</button>
          </form>
        </mat-card-content>
      </mat-card>
      <mat-card>
        <mat-card-header><mat-card-title>Feature Toggles</mat-card-title></mat-card-header>
        <mat-card-content>
          <div class="toggle-item"><span>Enable Vendor Registration</span><mat-slide-toggle formControlName="vendorRegistration"></mat-slide-toggle></div>
          <div class="toggle-item"><span>Enable Customer Reviews</span><mat-slide-toggle formControlName="customerReviews"></mat-slide-toggle></div>
          <div class="toggle-item"><span>Enable Coupon System</span><mat-slide-toggle formControlName="couponSystem"></mat-slide-toggle></div>
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
    .mat-mdc-form-field { width: 100%; }
    .toggle-item { display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid #eee; }
    .toggle-item:last-child { border-bottom: none; }
  `]
})
export class AdminSettingsComponent {
  fb = inject(FormBuilder);
  snackBar = inject(MatSnackBar);

  settingsForm: FormGroup = this.fb.group({
    siteName: ['MarketPlace'],
    supportEmail: ['support@marketplace.com'],
    supportPhone: ['+91 9876543210'],
    vendorRegistration: [true],
    customerReviews: [true],
    couponSystem: [true]
  });

  saveSettings(): void { this.snackBar.open('Settings saved!', 'Close', { duration: 3000 }); }
}
