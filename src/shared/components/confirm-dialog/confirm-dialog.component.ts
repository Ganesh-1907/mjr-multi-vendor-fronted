import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
  isPrompt?: boolean;
  promptValue?: string;
  promptPlaceholder?: string;
  promptRequired?: boolean;
  okText?: string;
  cancelText?: string;
  color?: 'primary' | 'accent' | 'warn';
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title class="dialog-title">
      <mat-icon [color]="data.color || 'primary'">{{ getIcon() }}</mat-icon>
      <span>{{ data.title }}</span>
    </h2>
    
    <mat-dialog-content class="dialog-content">
      <p class="dialog-message">{{ data.message }}</p>
      
      @if (data.isPrompt) {
        <mat-form-field appearance="outline" class="prompt-field">
          <mat-label>{{ data.promptPlaceholder || 'Reason' }}</mat-label>
          <textarea 
            matInput 
            rows="3" 
            [(ngModel)]="promptValue" 
            [placeholder]="data.promptPlaceholder || ''"
            [required]="data.promptRequired !== false">
          </textarea>
        </mat-form-field>
      }
    </mat-dialog-content>
    
    <mat-dialog-actions align="end" class="dialog-actions">
      <button mat-button (click)="onCancel()">{{ data.cancelText || 'Cancel' }}</button>
      <button 
        mat-raised-button 
        [color]="data.color || 'primary'" 
        [disabled]="data.isPrompt && data.promptRequired !== false && !promptValue.trim()"
        (click)="onConfirm()">
        {{ data.okText || 'Confirm' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-title {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0;
      padding: 20px 24px 12px;
      font-size: 20px;
      font-weight: 600;
      border-bottom: 1px solid var(--border-color);
      
      mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }
    }
    
    .dialog-content {
      padding: 24px !important;
      margin: 0;
      color: var(--text-secondary);
      font-size: 15px;
      line-height: 1.5;
      
      .dialog-message {
        margin: 0 0 16px 0;
      }
      
      .prompt-field {
        width: 100%;
        margin-top: 8px;
        
        textarea {
          resize: vertical;
          min-height: 80px;
        }
      }
    }
    
    .dialog-actions {
      padding: 12px 24px 16px !important;
      border-top: 1px solid var(--border-color);
      gap: 8px;
      margin: 0;
    }
  `]
})
export class ConfirmDialogComponent {
  promptValue = '';

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {
    if (data.promptValue) {
      this.promptValue = data.promptValue;
    }
  }

  getIcon(): string {
    if (this.data.color === 'warn') {
      return 'warning';
    }
    return this.data.isPrompt ? 'rate_review' : 'help_outline';
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  onConfirm(): void {
    if (this.data.isPrompt) {
      this.dialogRef.close(this.promptValue.trim());
    } else {
      this.dialogRef.close(true);
    }
  }
}
