import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { DataService } from '../../../core/services/data.service';

@Component({
  selector: 'app-vendor-store',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatButtonModule, MatCardModule, MatInputModule, MatFormFieldModule],
  template: `
    <div class="store-page">
      <h1>Store Profile</h1>
      <mat-card>
        <mat-card-header><mat-card-title>Store Information</mat-card-title></mat-card-header>
        <mat-card-content>
          <form [formGroup]="storeForm" (ngSubmit)="saveStore()">
            <div class="form-row">
              <mat-form-field appearance="outline"><mat-label>Store Name</mat-label>
                <input matInput formControlName="storeName"><mat-icon matPrefix>store</mat-icon>
              </mat-form-field>
              <mat-form-field appearance="outline"><mat-label>Business Email</mat-label>
                <input matInput formControlName="businessEmail" type="email"><mat-icon matPrefix>email</mat-icon>
              </mat-form-field>
            </div>
            <mat-form-field appearance="outline"><mat-label>Store Description</mat-label>
              <textarea matInput rows="4" formControlName="storeDescription"></textarea>
            </mat-form-field>
            <div class="form-row">
              <mat-form-field appearance="outline"><mat-label>Business Phone</mat-label>
                <input matInput formControlName="businessPhone"><mat-icon matPrefix>phone</mat-icon>
              </mat-form-field>
              <mat-form-field appearance="outline"><mat-label>GST Number</mat-label>
                <input matInput formControlName="gstNumber"><mat-icon matPrefix>receipt</mat-icon>
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline"><mat-label>PAN Number</mat-label>
                <input matInput formControlName="panNumber"><mat-icon matPrefix>badge</mat-icon>
              </mat-form-field>
            </div>
            <button mat-raised-button color="primary" type="submit">Save Changes</button>
          </form>
        </mat-card-content>
      </mat-card>
      <mat-card>
        <mat-card-header><mat-card-title>Bank Account Details</mat-card-title></mat-card-header>
        <mat-card-content>
          <form [formGroup]="bankForm" (ngSubmit)="saveBank()">
            <div class="form-row">
              <mat-form-field appearance="outline"><mat-label>Bank Name</mat-label>
                <input matInput formControlName="bankName"><mat-icon matPrefix>account_balance</mat-icon>
              </mat-form-field>
              <mat-form-field appearance="outline"><mat-label>Account Number</mat-label>
                <input matInput formControlName="bankAccountNo"><mat-icon matPrefix>credit_card</mat-icon>
              </mat-form-field>
            </div>
            <mat-form-field appearance="outline"><mat-label>IFSC Code</mat-label>
              <input matInput formControlName="bankIfsc"><mat-icon matPrefix>qr_code</mat-icon>
            </mat-form-field>
            <button mat-raised-button color="primary" type="submit">Update Bank Details</button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .store-page { max-width: 800px; margin: 0 auto; }
    h1 { margin-bottom: 24px; }
    mat-card { margin-bottom: 16px; }
    mat-card-content { padding: 16px !important; }
    form { display: flex; flex-direction: column; gap: 16px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .mat-mdc-form-field { width: 100%; }
    @media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } }
  `]
})
export class StoreComponent {
  auth = inject(AuthService);
  dataService = inject(DataService);
  fb = inject(FormBuilder);
  snackBar = inject(MatSnackBar);

  vendor = this.dataService.getVendorById(this.auth.currentUser()?.id || '');

  storeForm: FormGroup = this.fb.group({
    storeName: [this.vendor?.storeName || '', Validators.required],
    storeDescription: [this.vendor?.storeDescription || ''],
    businessEmail: [this.vendor?.businessEmail || '', [Validators.required, Validators.email]],
    businessPhone: [this.vendor?.businessPhone || '', Validators.required],
    gstNumber: [this.vendor?.gstNumber || ''],
    panNumber: [this.vendor?.panNumber || '']
  });

  bankForm: FormGroup = this.fb.group({
    bankName: [this.vendor?.bankName || '', Validators.required],
    bankAccountNo: [this.vendor?.bankAccountNo || '', Validators.required],
    bankIfsc: [this.vendor?.bankIfsc || '', Validators.required]
  });

  saveStore(): void { this.snackBar.open('Store information updated!', 'Close', { duration: 3000 }); }
  saveBank(): void { this.snackBar.open('Bank details updated!', 'Close', { duration: 3000 }); }
}
