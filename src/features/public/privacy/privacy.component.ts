import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="privacy-page">
      <div class="hero"><h1>Privacy Policy</h1></div>
      <mat-card><mat-card-content>
        <h2>1. Information Collection</h2>
        <p>We collect name, email, phone, shipping address, and payment information for order processing.</p>
        <h2>2. Use of Information</h2>
        <p>Your information is used to process orders, provide support, and improve our services.</p>
        <h2>3. Data Security</h2>
        <p>We implement SSL encryption and secure servers. Payment data is processed through PCI-compliant gateways.</p>
        <h2>4. Cookies</h2>
        <p>We use cookies for session management and analytics. You can disable cookies in your browser.</p>
        <h2>5. Data Sharing</h2>
        <p>We share data with sellers (for orders), shipping partners, and payment processors only.</p>
        <h2>6. Your Rights</h2>
        <p>You can request access, corrections, or deletion of your personal data by contacting support.</p>
      </mat-card-content></mat-card>
    </div>
  `,
  styles: [`.privacy-page{max-width:900px;margin:0 auto;padding:24px}.hero{text-align:center;padding:40px 16px;background:#1a237e;color:white;margin:-24px -24px 32px}mat-card-content{padding:32px}h2{font-size:20px;color:#1a237e;margin:24px 0 12px}p{line-height:1.7;color:#555}`]
})
export class PrivacyComponent {}
