import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiDataService } from '../../../core/services/api-data.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule
  ],
  template: `
    <div class="contact-page">
      <div class="hero">
        <h1>Contact Us</h1>
        <p>Get in touch with our team. We are here to help you 24/7.</p>
      </div>

      <div class="content-wrapper">
        <div class="content">
          <!-- Contact Form Card -->
          <mat-card class="contact-card">
            <mat-card-content>
              <h2 class="section-title">Send us a Message</h2>
              <p class="section-desc">Have a question or feedback? Fill out the form below and we'll get back to you shortly.</p>
              
              <form [formGroup]="contactForm" (ngSubmit)="submit()">
                <div class="form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>First Name</mat-label>
                    <input matInput formControlName="firstName" placeholder="John">
                    <mat-icon matPrefix>person</mat-icon>
                    <mat-error *ngIf="contactForm.get('firstName')?.hasError('required')">First name is required</mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Last Name</mat-label>
                    <input matInput formControlName="lastName" placeholder="Doe">
                    <mat-icon matPrefix>person_outline</mat-icon>
                    <mat-error *ngIf="contactForm.get('lastName')?.hasError('required')">Last name is required</mat-error>
                  </mat-form-field>
                </div>

                <mat-form-field appearance="outline">
                  <mat-label>Email Address</mat-label>
                  <input matInput type="email" formControlName="email" placeholder="john.doe@example.com">
                  <mat-icon matPrefix>email</mat-icon>
                  <mat-error *ngIf="contactForm.get('email')?.hasError('required')">Email is required</mat-error>
                  <mat-error *ngIf="contactForm.get('email')?.hasError('email')">Please enter a valid email address</mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Subject</mat-label>
                  <input matInput formControlName="subject" placeholder="How can we help you?">
                  <mat-icon matPrefix>subtitles</mat-icon>
                  <mat-error *ngIf="contactForm.get('subject')?.hasError('required')">Subject is required</mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Message</mat-label>
                  <textarea matInput rows="6" formControlName="message" placeholder="Write your message here..."></textarea>
                  <mat-icon matPrefix>chat</mat-icon>
                  <mat-error *ngIf="contactForm.get('message')?.hasError('required')">Message is required</mat-error>
                </mat-form-field>

                <button mat-flat-button color="primary" class="submit-btn" type="submit" [disabled]="contactForm.invalid || isSubmitting()">
                  <mat-icon *ngIf="!isSubmitting()">send</mat-icon>
                  <span>{{ isSubmitting() ? 'Sending...' : 'Send Message' }}</span>
                </button>
              </form>
            </mat-card-content>
          </mat-card>

          <!-- Contact Information Sidebar -->
          <div class="contact-info">
            <div class="info-item">
              <div class="icon-wrapper">
                <mat-icon>location_on</mat-icon>
              </div>
              <h3>Our Office</h3>
              <p>123 Tech Park, Sector 63</p>
              <p class="sub-text">Noida, UP, India</p>
            </div>

            <div class="info-item">
              <div class="icon-wrapper">
                <mat-icon>phone</mat-icon>
              </div>
              <h3>Phone Call</h3>
              <p>+91 98765 43210</p>
              <p class="sub-text">Mon - Sat: 9 AM - 6 PM</p>
            </div>

            <div class="info-item">
              <div class="icon-wrapper">
                <mat-icon>email</mat-icon>
              </div>
              <h3>Email Support</h3>
              <p>support&#64;marketplace.com</p>
              <p class="sub-text">Response within 24 hours</p>
            </div>

            <div class="info-item">
              <div class="icon-wrapper">
                <mat-icon>forum</mat-icon>
              </div>
              <h3>Live Support</h3>
              <p>Available 24/7</p>
              <p class="sub-text">Via Customer Portal</p>
            </div>
          </div>
        </div>

        <!-- Interactive Map Section -->
        <div class="map-section">
          <mat-card class="map-card">
            <div class="map-overlay">
              <div class="overlay-card">
                <div class="overlay-header">
                  <mat-icon>storefront</mat-icon>
                  <div>
                    <h4>Corporate Headquarters</h4>
                    <p>Open for visits by appointment</p>
                  </div>
                </div>
                <div class="coordinates">
                  <span class="coord-tag">LAT: 28.6273° N</span>
                  <span class="coord-tag">LONG: 77.3725° E</span>
                </div>
              </div>
            </div>
            <div class="mock-map-graphics">
              <svg viewBox="0 0 1000 250" xmlns="http://www.w3.org/2000/svg" class="map-svg">
                <defs>
                  <pattern id="mapGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="var(--border-color)" stroke-width="0.5"/>
                  </pattern>
                  <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.25"/>
                    <stop offset="100%" stop-color="var(--primary)" stop-opacity="0"/>
                  </radialGradient>
                </defs>
                <rect width="100%" height="100%" fill="var(--bg-tertiary)" />
                <rect width="100%" height="100%" fill="url(#mapGrid)" />
                
                <!-- Map paths simulation -->
                <path d="M -50 80 Q 200 40 400 120 T 900 60" fill="none" stroke="var(--border-color)" stroke-width="3" opacity="0.6"/>
                <path d="M 100 -50 Q 250 120 400 120 T 700 300" fill="none" stroke="var(--border-color)" stroke-width="4" opacity="0.6"/>
                <path d="M 300 -50 L 300 300" fill="none" stroke="var(--border-color)" stroke-width="1.5" opacity="0.3"/>
                <path d="M -50 200 L 1100 200" fill="none" stroke="var(--border-color)" stroke-width="2" opacity="0.4"/>
                
                <!-- Main hub glow -->
                <circle cx="400" cy="120" r="100" fill="url(#mapGlow)" />
                <circle cx="400" cy="120" r="8" fill="var(--primary)" />
                <circle cx="400" cy="120" r="22" fill="none" stroke="var(--primary)" stroke-width="1.5" opacity="0.7">
                  <animate attributeName="r" values="8;30;8" dur="4s" repeatCount="indefinite" />
                </circle>
              </svg>
            </div>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .contact-page {
      width: 100%;
      max-width: none;
      margin: 0;
      padding: 0;
      background: var(--bg-primary);
      min-height: 100vh;
    }

    .hero {
      text-align: center;
      padding: 50px 24px;
      background: linear-gradient(135deg, #1a237e 0%, #311b92 100%);
      color: white;
      margin: 0 0 32px 0;
      box-shadow: var(--shadow-sm);
    }

    .hero h1 {
      font-size: 36px;
      font-weight: 800;
      margin-bottom: 12px;
      color: white !important;
      letter-spacing: -0.5px;
    }

    .hero p {
      opacity: 0.85;
      color: white !important;
      font-size: 16px;
      margin: 0;
    }

    .content-wrapper {
      width: 100%;
      max-width: 1800px;
      margin: 0 auto;
      padding: 0 24px 48px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .content {
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: 32px;
      width: 100%;
    }

    .contact-card {
      border: 1px solid var(--border-light) !important;
      box-shadow: var(--card-shadow) !important;
    }

    mat-card-content {
      padding: 32px !important;
    }

    .section-title {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 8px;
      color: var(--text-primary);
    }

    .section-desc {
      color: var(--text-secondary);
      font-size: 15px;
      margin-bottom: 24px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .mat-mdc-form-field {
      width: 100%;
      margin-bottom: 4px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .submit-btn {
      align-self: flex-start;
      padding: 12px 28px !important;
      height: 48px;
      font-weight: 600;
      border-radius: var(--radius-md) !important;
      margin-top: 12px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .info-item {
      background: var(--bg-secondary);
      padding: 24px;
      border-radius: var(--radius-md);
      text-align: center;
      border: 1px solid var(--border-light);
      box-shadow: var(--shadow-sm);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .info-item:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .icon-wrapper {
      width: 48px;
      height: 48px;
      background: var(--primary-light);
      color: var(--primary);
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 12px;
    }

    .icon-wrapper mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .info-item h3 {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 6px;
      color: var(--text-primary);
    }

    .info-item p {
      font-size: 14px;
      color: var(--text-secondary);
      margin: 0 0 2px 0;
    }

    .info-item .sub-text {
      color: var(--text-muted);
      font-size: 12px;
    }

    /* Map Section Styling */
    .map-section {
      width: 100%;
    }

    .map-card {
      position: relative;
      overflow: hidden;
      border: 1px solid var(--border-light) !important;
      box-shadow: var(--card-shadow) !important;
    }

    .map-overlay {
      position: absolute;
      top: 20px;
      left: 20px;
      z-index: 5;
    }

    .overlay-card {
      background: var(--glass-bg);
      backdrop-filter: var(--glass-blur);
      border: 1px solid var(--glass-border);
      padding: 16px;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      max-width: 320px;
    }

    .overlay-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .overlay-header mat-icon {
      color: var(--primary);
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .overlay-header h4 {
      margin: 0 0 2px 0;
      font-size: 14px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .overlay-header p {
      margin: 0;
      font-size: 12px;
      color: var(--text-secondary);
    }

    .coordinates {
      display: flex;
      gap: 8px;
    }

    .coord-tag {
      background: var(--bg-tertiary);
      color: var(--text-secondary);
      padding: 4px 8px;
      border-radius: var(--radius-sm);
      font-size: 10px;
      font-family: monospace;
      font-weight: 600;
      border: 1px solid var(--border-light);
    }

    .mock-map-graphics {
      width: 100%;
      height: 250px;
      display: block;
    }

    .map-svg {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    @media (max-width: 992px) {
      .content {
        grid-template-columns: 1fr;
      }
      .contact-info {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 20px;
      }
    }

    @media (max-width: 600px) {
      .form-row {
        grid-template-columns: 1fr;
        gap: 0;
      }
      .overlay-card {
        max-width: calc(100% - 40px);
      }
    }
  `]
})
export class ContactComponent {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private apiData = inject(ApiDataService);

  isSubmitting = signal(false);

  contactForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', Validators.required],
    message: ['', Validators.required]
  });

  submit(): void {
    if (this.contactForm.valid) {
      this.isSubmitting.set(true);
      this.apiData.submitContactInquiry(this.contactForm.value).subscribe({
        next: () => {
          this.snackBar.open('Message sent successfully! We will contact you soon.', 'Close', {
            duration: 4000,
            panelClass: ['success-snackbar']
          });
          this.contactForm.reset();
          this.isSubmitting.set(false);
        },
        error: (err) => {
          this.snackBar.open(err.error?.message || 'Failed to send message. Please try again.', 'Close', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
          this.isSubmitting.set(false);
        }
      });
    }
  }
}
