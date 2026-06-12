import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Address } from '../../../core/models';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule],
  template: `
    <div class="addresses-page">
      <div class="page-header">
        <h1>My Addresses</h1>
        <button mat-raised-button color="primary"><mat-icon>add</mat-icon> Add New Address</button>
      </div>
      <div class="addresses-grid">
        @for (address of addresses; track address.id) {
          <mat-card class="address-card" [class.default]="address.isDefault">
            <mat-card-content>
              <div class="address-header">
                <span class="type-badge">{{address.type}}</span>
                @if (address.isDefault) {
                  <span class="default-badge">Default</span>
                }
              </div>
              <p class="name">{{address.fullName}}</p>
              <p>{{address.addressLine1}}</p>
              @if (address.addressLine2) {
                <p>{{address.addressLine2}}</p>
              }
              <p>{{address.city}}, {{address.state}} - {{address.pincode}}</p>
              <p class="phone">Phone: {{address.phone}}</p>
              <div class="address-actions">
                <button mat-stroked-button><mat-icon>edit</mat-icon> Edit</button>
                @if (!address.isDefault) {
                  <button mat-stroked-button color="warn"><mat-icon>delete</mat-icon> Delete</button>
                }
              </div>
            </mat-card-content>
          </mat-card>
        }
      </div>
    </div>
  `,
  styles: [`
    .addresses-page { max-width: 1000px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
    .page-header h1 { margin: 0; }
    .addresses-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
    .address-card { position: relative; }
    .address-card.default { border: 2px solid #1a237e; }
    .address-header { display: flex; gap: 8px; margin-bottom: 12px; }
    .type-badge { background: #e3f2fd; color: #1565c0; padding: 2px 8px; border-radius: 4px; font-size: 12px; text-transform: capitalize; }
    .default-badge { background: #1a237e; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
    .name { font-weight: 600; margin-bottom: 4px; }
    .phone { color: #757575; margin-top: 8px; }
    .address-actions { display: flex; gap: 12px; margin-top: 16px; }
    .address-actions button { flex: 1; }
  `]
})
export class AddressesComponent {
  auth = inject(AuthService);
  snackBar = inject(MatSnackBar);
  addresses: Address[] = [
    { id: '1', type: 'home', fullName: 'John Doe', phone: '9876543210', addressLine1: '123 Main Street', addressLine2: 'Apt 4B', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', isDefault: true },
    { id: '2', type: 'work', fullName: 'John Doe', phone: '9876543210', addressLine1: '456 Park Avenue', city: 'Delhi', state: 'Delhi', pincode: '110001', isDefault: false }
  ];
}
