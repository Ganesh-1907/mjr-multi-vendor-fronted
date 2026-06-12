import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatIconModule],
  template: `
    <div class="faq-page">
      <div class="hero">
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common questions</p>
      </div>
      <div class="content">
        <mat-accordion>
          @for (faq of faqs; track faq.question) {
            <mat-expansion-panel>
              <mat-expansion-panel-header>
                <mat-panel-title>{{faq.question}}</mat-panel-title>
              </mat-expansion-panel-header>
              <p>{{faq.answer}}</p>
            </mat-expansion-panel>
          }
        </mat-accordion>
      </div>
    </div>
  `,
  styles: [`
    .faq-page { max-width: 800px; margin: 0 auto; padding: 24px; }
    .hero { text-align: center; padding: 48px 16px; background: linear-gradient(135deg, #1a237e 0%, #3949ab 100%); color: white; margin: -24px -24px 32px; }
    .hero h1 { font-size: 32px; margin-bottom: 8px; }
    .content { padding: 0 16px; }
    mat-accordion { display: flex; flex-direction: column; gap: 12px; }
    mat-expansion-panel { border-radius: 8px !important; }
    p { line-height: 1.6; color: #616161; margin: 0; }
  `]
})
export class FaqComponent {
  faqs = [
    { question: 'How do I place an order?', answer: 'Browse products, add items to cart, proceed to checkout, select shipping address and payment method, then confirm your order.' },
    { question: 'What payment methods are accepted?', answer: 'We accept credit/debit cards, UPI, net banking, wallet payments, and cash on delivery for eligible orders.' },
    { question: 'How can I track my order?', answer: 'Go to Orders section in your dashboard after logging in. Each order has tracking information updated in real-time.' },
    { question: 'What is your return policy?', answer: 'We offer 7-day easy returns for most products. Items must be unused with original packaging and tags intact.' },
    { question: 'How do I become a vendor?', answer: 'Click Register and select Vendor. Complete the registration with your business details. After verification, you can start selling.' },
    { question: 'Is my payment secure?', answer: 'Yes, we use SSL encryption and partner with trusted payment gateways. Your payment information is never stored on our servers.' }
  ];
}
