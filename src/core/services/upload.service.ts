import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, throwError } from 'rxjs';
import { timeout, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponse } from './api.service';

@Injectable({ providedIn: 'root' })
export class UploadService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;

  uploadFile(file: File): Observable<string> {
    if (!file.type.startsWith('image/')) {
      return throwError(() => new Error('Invalid file type. Only images are allowed.'));
    }

    if (file.size > 5 * 1024 * 1024) {
      return throwError(() => new Error('Image size must be less than 5MB.'));
    }

    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<{ url: string }>>(`${this.baseUrl}/upload`, formData)
      .pipe(
        timeout(60000), // 60 seconds for uploads
        retry(1),
        map(res => res.data.url)
      );
  }
}
