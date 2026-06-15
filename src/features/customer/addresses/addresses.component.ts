import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../../core/services/auth.service';
import { ApiDataService } from '../../../core/services/api-data.service';

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  template: `
    <div class="addresses-page">
      <h1>My Shipping Address</h1>
      <p class="subtitle">Update your primary delivery address for orders and invoicing.</p>
      
      <mat-card class="address-form-card">
        <mat-card-content>
          <form [formGroup]="addressForm" (ngSubmit)="saveAddress()">
            
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Full Name</mat-label>
                <input matInput formControlName="fullName" placeholder="Enter your full name">
                <mat-icon matPrefix>person</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Phone Number</mat-label>
                <input matInput formControlName="phone" placeholder="Enter phone number">
                <mat-icon matPrefix>phone</mat-icon>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Address Line 1</mat-label>
              <input matInput formControlName="addressLine1" placeholder="House number, Street name, Area">
              <mat-icon matPrefix>home</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Address Line 2 (Optional)</mat-label>
              <input matInput formControlName="addressLine2" placeholder="Apartment, suite, unit, landmark">
              <mat-icon matPrefix>location_city</mat-icon>
            </mat-form-field>

            <div class="form-row triple">
              <mat-form-field appearance="outline">
                <mat-label>City</mat-label>
                <input matInput formControlName="city" placeholder="City">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>State</mat-label>
                <input matInput formControlName="state" placeholder="State">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Pincode</mat-label>
                <input matInput formControlName="pincode" placeholder="6-digit ZIP/Pincode">
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Address Type</mat-label>
                <mat-select formControlName="type">
                  <mat-option value="HOME">Home</mat-option>
                  <mat-option value="WORK">Work</mat-option>
                  <mat-option value="OTHER">Other</mat-option>
                </mat-select>
                <mat-icon matPrefix>label</mat-icon>
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="addressForm.invalid">
                <mat-icon>save</mat-icon> Save Address
              </button>
            </div>

          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .addresses-page {
      max-width: 900px;
      margin: 0 auto;
      padding: 16px 24px;
    }
    h1 {
      margin-bottom: 4px;
      font-size: 28px;
      font-weight: 700;
      color: var(--text-primary, #111827);
    }
    .subtitle {
      color: #6b7280;
      margin-bottom: 24px;
      font-size: 14px;
    }
    .address-form-card {
      padding: 16px;
      border-radius: var(--radius-lg, 12px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      width: 100%;
    }
    .form-row.triple {
      grid-template-columns: 1fr 1fr 1fr;
    }
    .full-width {
      width: 100%;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 12px;
    }
    .form-actions button {
      padding: 10px 24px !important;
      font-weight: 600;
      border-radius: var(--radius-md, 8px);
    }
    @media (max-width: 768px) {
      .form-row, .form-row.triple {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AddressesComponent implements OnInit {
  auth = inject(AuthService);
  apiData = inject(ApiDataService);
  snackBar = inject(MatSnackBar);
  fb = inject(FormBuilder);

  addressId = signal<number | null>(null);

  addressForm: FormGroup = this.fb.group({
    type: ['HOME', Validators.required],
    fullName: ['', Validators.required],
    phone: ['', Validators.required],
    addressLine1: ['', Validators.required],
    addressLine2: [''],
    city: ['', Validators.required],
    state: ['', Validators.required],
    pincode: ['', Validators.required],
    isDefault: [true]
  });

  ngOnInit(): void {
    this.loadAddresses();
  }

  loadAddresses(): void {
    this.apiData.getAddresses().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          const addr = data[0];
          this.addressId.set(addr.id);
          this.addressForm.patchValue({
            type: addr.type,
            fullName: addr.fullName,
            phone: addr.phone,
            addressLine1: addr.addressLine1,
            addressLine2: addr.addressLine2 || '',
            city: addr.city,
            state: addr.state,
            pincode: addr.pincode,
            isDefault: addr.isDefault
          });
        } else {
          this.addressId.set(null);
        }
      },
      error: () => {
        this.snackBar.open('Failed to load address data.', 'Close', { duration: 4000 });
      }
    });
  }

  saveAddress(): void {
    if (this.addressForm.invalid) {
      this.snackBar.open('Please fill out all required fields.', 'Close', { duration: 3000 });
      return;
    }

    const formValue = this.addressForm.value;
    const id = this.addressId();

    if (id) {
      this.apiData.updateAddress(id, formValue).subscribe({
        next: () => {
          this.snackBar.open('Address updated successfully!', 'Close', { duration: 3000 });
          this.loadAddresses();
        },
        error: (err) => {
          this.snackBar.open(err?.error?.message || 'Failed to update address.', 'Close', { duration: 4000 });
        }
      });
    } else {
      this.apiData.addAddress(formValue).subscribe({
        next: () => {
          this.snackBar.open('Address saved successfully!', 'Close', { duration: 3000 });
          this.loadAddresses();
        },
        error: (err) => {
          this.snackBar.open(err?.error?.message || 'Failed to save address.', 'Close', { duration: 4000 });
        }
      });
    }
  }
}
