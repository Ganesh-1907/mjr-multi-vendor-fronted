import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatButtonModule, MatCardModule, MatInputModule, MatFormFieldModule],
  template: `
    <div class="contact-page">
      <div class="hero">
        <h1>Contact Us</h1>
        <p>We're here to help you</p>
      </div>
      <div class="content">
        <mat-card class="contact-card">
          <mat-card-content>
            <form [formGroup]="contactForm" (ngSubmit)="submit()">
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>First Name</mat-label>
                  <input matInput formControlName="firstName">
                  <mat-icon matPrefix>person</mat-icon>
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Last Name</mat-label>
                  <input matInput formControlName="lastName">
                </mat-form-field>
              </div>
              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput type="email" formControlName="email">
                <mat-icon matPrefix>email</mat-icon>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Subject</mat-label>
                <input matInput formControlName="subject">
                <mat-icon matPrefix>title</mat-icon>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Message</mat-label>
                <textarea matInput rows="5" formControlName="message"></textarea>
                <mat-icon matPrefix>message</mat-icon>
              </mat-form-field>
              <button mat-raised-button color="primary" type="submit" [disabled]="contactForm.invalid">Send Message</button>
            </form>
          </mat-card-content>
        </mat-card>
        <div class="contact-info">
          <div class="info-item">
            <mat-icon>location_on</mat-icon>
            <h3>Address</h3>
            <p>123 Market Street, Mumbai, India</p>
          </div>
          <div class="info-item">
            <mat-icon>phone</mat-icon>
            <h3>Phone</h3>
            <p>+91 9876543210</p>
          </div>
          <div class="info-item">
            <mat-icon>email</mat-icon>
            <h3>Email</h3>
            <p>support&#64;marketplace.com</p>
          </div>
          <div class="info-item">
            <mat-icon>schedule</mat-icon>
            <h3>Hours</h3>
            <p>24/7 Support Available</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .contact-page { max-width: 1000px; margin: 0 auto; padding: 24px; }
    .hero { text-align: center; padding: 48px 16px; background: linear-gradient(135deg, #1a237e 0%, #3949ab 100%); color: white; margin: -24px -24px 32px; }
    .hero h1 { font-size: 36px; margin-bottom: 8px; }
    .content { display: grid; grid-template-columns: 1fr 300px; gap: 24px; }
    .contact-card { padding: 8px; }
    mat-card-content { padding: 24px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .mat-mdc-form-field { width: 100%; }
    form { display: flex; flex-direction: column; gap: 16px; }
    button[type="submit"] { margin-top: 8px; }
    .contact-info { display: flex; flex-direction: column; gap: 16px; }
    .info-item { background: #f5f5f5; padding: 20px; border-radius: 12px; text-align: center; }
    .info-item mat-icon { font-size: 32px; color: #1a237e; margin-bottom: 8px; }
    .info-item h3 { font-size: 16px; margin-bottom: 4px; }
    .info-item p { font-size: 14px; color: #666; margin: 0; }
    @media (max-width: 768px) { .content { grid-template-columns: 1fr; } .form-row { grid-template-columns: 1fr; } }
  `]
})
export class ContactComponent {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  contactForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', Validators.required],
    message: ['', Validators.required]
  });

  submit(): void {
    if (this.contactForm.valid) {
      this.snackBar.open('Message sent successfully!', 'Close', { duration: 3000 });
      this.contactForm.reset();
    }
  }
}
