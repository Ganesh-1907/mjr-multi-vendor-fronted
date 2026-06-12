import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatButtonModule, MatCardModule, MatInputModule, MatFormFieldModule],
  template: `
    <div class="support-page">
      <div class="page-header">
        <h1>Customer Support</h1>
        <p>Submit a ticket and our team will get back to you</p>
      </div>
      <div class="support-grid">
        <mat-card class="ticket-form-card">
          <mat-card-header><mat-card-title>Create New Ticket</mat-card-title></mat-card-header>
          <mat-card-content>
            <form [formGroup]="ticketForm" (ngSubmit)="submitTicket()">
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
              <button mat-raised-button color="primary" type="submit" [disabled]="ticketForm.invalid">Submit Ticket</button>
            </form>
          </mat-card-content>
        </mat-card>
        <div class="contact-info">
          <mat-card>
            <mat-card-content>
              <h3>Quick Help</h3>
              <p><mat-icon>question_answer</mat-icon> <a routerLink="/faq">View FAQs</a></p>
              <p><mat-icon>email</mat-icon> support&#64;marketplace.com</p>
              <p><mat-icon>phone</mat-icon> +91 9876543210</p>
              <p><mat-icon>schedule</mat-icon> 24/7 Support Available</p>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .support-page { max-width: 900px; margin: 0 auto; }
    .page-header { margin-bottom: 24px; }
    .support-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }
    mat-card-content { padding: 16px !important; }
    form { display: flex; flex-direction: column; gap: 16px; }
    .mat-mdc-form-field { width: 100%; }
    .contact-info h3 { margin-bottom: 16px; }
    .contact-info p { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
    .contact-info mat-icon { color: #1a237e; }
    @media (max-width: 768px) { .support-grid { grid-template-columns: 1fr; } }
  `]
})
export class SupportComponent {
  fb = inject(FormBuilder);
  snackBar = inject(MatSnackBar);
  ticketForm: FormGroup = this.fb.group({ subject: ['', Validators.required], message: ['', Validators.required] });
  submitTicket(): void {
    this.snackBar.open('Ticket submitted successfully!', 'Close', { duration: 3000 });
    this.ticketForm.reset();
  }
}
