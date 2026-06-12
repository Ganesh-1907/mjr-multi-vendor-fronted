import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="terms-page">
      <div class="hero"><h1>Terms of Service</h1></div>
      <mat-card><mat-card-content>
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing MarketPlace, you agree to these terms. If you disagree, please do not use our platform.</p>
        <h2>2. User Accounts</h2>
        <p>Users must provide accurate information. You are responsible for maintaining account security.</p>
        <h2>3. Buying & Selling</h2>
        <p>All transactions must be conducted through our platform. Sellers must provide accurate product descriptions.</p>
        <h2>4. Prohibited Activities</h2>
        <p>Selling illegal items, fraudulent activities, and spam are strictly prohibited.</p>
        <h2>5. Disputes</h2>
        <p>Contact support for disputes. We reserve the right to mediate between buyers and sellers.</p>
        <h2>6. Changes</h2>
        <p>We may update these terms. Continued use constitutes acceptance of changes.</p>
      </mat-card-content></mat-card>
    </div>
  `,
  styles: [`.terms-page{max-width:900px;margin:0 auto;padding:24px}.hero{text-align:center;padding:40px 16px;background:#1a237e;color:white;margin:-24px -24px 32px}mat-card-content{padding:32px}h2{font-size:20px;color:#1a237e;margin:24px 0 12px}p{line-height:1.7;color:#555}`]
})
export class TermsComponent {}
