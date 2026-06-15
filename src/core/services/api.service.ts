import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;

  get<T>(path: string, params?: Record<string, string | number | boolean | undefined | null>): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }
    return this.http.get<ApiResponse<T>>(`${this.baseUrl}${path}`, { params: httpParams })
      .pipe(map(res => res.data));
  }

  post<T>(path: string, body: any): Observable<T> {
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}${path}`, body)
      .pipe(map(res => res.data));
  }

  put<T>(path: string, body: any): Observable<T> {
    return this.http.put<ApiResponse<T>>(`${this.baseUrl}${path}`, body)
      .pipe(map(res => res.data));
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<ApiResponse<T>>(`${this.baseUrl}${path}`)
      .pipe(map(res => res.data));
  }

  getRaw<T>(path: string): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(`${this.baseUrl}${path}`);
  }

  postRaw<T>(path: string, body: any): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}${path}`, body);
  }

  putRaw<T>(path: string, body: any): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(`${this.baseUrl}${path}`, body);
  }

  deleteRaw<T>(path: string): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(`${this.baseUrl}${path}`);
  }
}
