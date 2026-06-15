import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { ApiDataService } from '../../../core/services/api-data.service';

@Component({
  selector: 'app-contact-detail-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <h2>Contact Inquiry Details</h2>
        <button mat-icon-button (click)="dialogRef.close()" title="Close">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      <div class="dialog-content">
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-label">Sender</span>
            <span class="detail-value">{{data.firstName}} {{data.lastName}}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Email Address</span>
            <span class="detail-value email"><a [href]="'mailto:' + data.email">{{data.email}}</a></span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Received Date</span>
            <span class="detail-value">{{data.createdAt | date:'medium'}}</span>
          </div>
          <div class="detail-item full-width">
            <span class="detail-label">Subject</span>
            <span class="detail-value subject">{{data.subject}}</span>
          </div>
          <div class="detail-item full-width message-box">
            <span class="detail-label">Message Content</span>
            <div class="message-content">{{data.message}}</div>
          </div>
        </div>
      </div>
      <div class="dialog-actions">
        <button mat-flat-button color="primary" (click)="dialogRef.close()">Close</button>
        <a mat-stroked-button [href]="'mailto:' + data.email + '?subject=Re: ' + data.subject" target="_blank">
          <mat-icon>reply</mat-icon> Reply via Email
        </a>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 24px;
      background: var(--bg-secondary);
      color: var(--text-primary);
      max-width: 600px;
    }
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 12px;
    }
    .dialog-header h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 700;
    }
    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .full-width {
      grid-column: span 2;
    }
    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .detail-label {
      font-size: 12px;
      color: var(--text-muted);
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    .detail-value {
      font-size: 15px;
      color: var(--text-primary);
      font-weight: 500;
    }
    .email a {
      color: var(--primary);
      text-decoration: none;
    }
    .email a:hover {
      text-decoration: underline;
    }
    .subject {
      font-weight: 600;
    }
    .message-box {
      margin-top: 8px;
    }
    .message-content {
      background: var(--bg-tertiary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      padding: 16px;
      font-size: 14px;
      line-height: 1.6;
      white-space: pre-wrap;
      max-height: 250px;
      overflow-y: auto;
    }
    .dialog-actions {
      margin-top: 24px;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      border-top: 1px solid var(--border-color);
      padding-top: 16px;
    }
  `]
})
export class ContactDetailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ContactDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}

@Component({
  selector: 'app-admin-contacts',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatSnackBarModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatDialogModule
  ],
  template: `
    <div class="contacts-page">
      <div class="page-header">
        <h1>Contact Messages & Inquiries</h1>
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search messages</mat-label>
          <input matInput (keyup)="applyFilter($event)" placeholder="Search by name, email or subject...">
          <mat-icon matPrefix>search</mat-icon>
        </mat-form-field>
      </div>

      <mat-card class="table-card">
        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="filteredMessages()" class="contacts-table">
              
              <!-- Date Column -->
              <ng-container matColumnDef="date">
                <th mat-header-cell *matHeaderCellDef>Received Date</th>
                <td mat-cell *matCellDef="let msg">
                  <span class="date-text">{{ msg.createdAt | date:'medium' }}</span>
                </td>
              </ng-container>

              <!-- Name Column -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Sender</th>
                <td mat-cell *matCellDef="let msg">
                  <div class="sender-info">
                    <div class="avatar">{{ msg.firstName?.[0] }}{{ msg.lastName?.[0] }}</div>
                    <div class="sender-details">
                      <span class="sender-name">{{ msg.firstName }} {{ msg.lastName }}</span>
                      <span class="sender-email">{{ msg.email }}</span>
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Subject Column -->
              <ng-container matColumnDef="subject">
                <th mat-header-cell *matHeaderCellDef>Subject</th>
                <td mat-cell *matCellDef="let msg">
                  <span class="subject-text">{{ msg.subject }}</span>
                </td>
              </ng-container>

              <!-- Message Preview Column -->
              <ng-container matColumnDef="message">
                <th mat-header-cell *matHeaderCellDef>Message Preview</th>
                <td mat-cell *matCellDef="let msg">
                  <span class="message-preview">{{ getPreview(msg.message) }}</span>
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let msg">
                  <div class="action-buttons">
                    <button mat-icon-button color="primary" matTooltip="Read Message" (click)="viewDetails(msg)">
                      <mat-icon>visibility</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" matTooltip="Delete Message" (click)="deleteMessage(msg.id)">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              
              <!-- Row shown when there is no matching data. -->
              <tr class="mat-row" *matNoDataRow>
                <td class="mat-cell no-data-cell" [attr.colspan]="displayedColumns.length">
                  <div class="no-data-state">
                    <mat-icon class="no-data-icon">mail_outline</mat-icon>
                    <span>No contact inquiries found.</span>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .contacts-page {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .page-header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .search-field {
      width: 320px;
    }

    .table-card {
      border: 1px solid var(--border-light) !important;
      box-shadow: var(--card-shadow) !important;
    }

    .table-container {
      overflow-x: auto;
      width: 100%;
    }

    .contacts-table {
      width: 100%;
      background: transparent !important;
    }

    th {
      font-weight: 600;
      color: var(--text-muted);
      white-space: nowrap;
      border-bottom: 1px solid var(--border-color);
      padding: 16px !important;
    }

    td {
      vertical-align: middle;
      border-bottom: 1px solid var(--border-color);
      padding: 12px 16px !important;
      color: var(--text-primary);
    }

    .date-text {
      font-size: 13px;
      color: var(--text-secondary);
    }

    .sender-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .avatar {
      width: 38px;
      height: 38px;
      border-radius: var(--radius-full);
      background: var(--primary-light);
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 600;
      flex-shrink: 0;
    }

    .sender-details {
      display: flex;
      flex-direction: column;
    }

    .sender-name {
      font-weight: 600;
      font-size: 14px;
      color: var(--text-primary);
    }

    .sender-email {
      font-size: 12px;
      color: var(--text-muted);
    }

    .subject-text {
      font-weight: 500;
      color: var(--text-primary);
    }

    .message-preview {
      color: var(--text-secondary);
      font-size: 13px;
      max-width: 300px;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .action-buttons {
      display: flex;
      gap: 4px;
    }

    .no-data-cell {
      padding: 48px !important;
    }

    .no-data-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
      gap: 12px;
    }

    .no-data-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: var(--text-muted);
    }

    @media (max-width: 992px) {
      .page-header {
        flex-direction: column;
        align-items: stretch;
      }
      .search-field {
        width: 100%;
      }
    }
  `]
})
export class AdminContactsComponent implements OnInit {
  private apiData = inject(ApiDataService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  messages = signal<any[]>([]);
  filteredMessages = signal<any[]>([]);
  displayedColumns = ['date', 'name', 'subject', 'message', 'actions'];

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.apiData.getContactInquiries().subscribe({
      next: (data) => {
        this.messages.set(data);
        this.filteredMessages.set(data);
      },
      error: () => {
        this.snackBar.open('Failed to load contact inquiries.', 'Close', { duration: 3000 });
      }
    });
  }

  getPreview(message: string): string {
    if (!message) return '';
    return message.length > 65 ? message.substring(0, 65) + '...' : message;
  }

  applyFilter(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase().trim();
    if (!query) {
      this.filteredMessages.set(this.messages());
      return;
    }
    this.filteredMessages.set(
      this.messages().filter((m: any) =>
        m.firstName?.toLowerCase().includes(query) ||
        m.lastName?.toLowerCase().includes(query) ||
        m.email?.toLowerCase().includes(query) ||
        m.subject?.toLowerCase().includes(query) ||
        m.message?.toLowerCase().includes(query)
      )
    );
  }

  viewDetails(msg: any): void {
    this.dialog.open(ContactDetailDialogComponent, {
      data: msg,
      width: '600px',
      panelClass: 'custom-dialog-panel'
    });
  }

  deleteMessage(id: number): void {
    if (confirm('Are you sure you want to delete this inquiry?')) {
      this.apiData.deleteContactInquiry(id).subscribe({
        next: () => {
          this.snackBar.open('Inquiry deleted successfully.', 'Close', { duration: 3000 });
          this.loadMessages();
        },
        error: () => {
          this.snackBar.open('Failed to delete inquiry.', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
