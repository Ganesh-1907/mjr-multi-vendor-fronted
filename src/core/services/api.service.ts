import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, timeout, retry } from 'rxjs/operators';
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

  private mapIds(data: any): any {
    if (data === null || typeof data !== 'object') return data;
    if (Array.isArray(data)) {
      return data.map(item => this.mapIds(item));
    }
    const mapped: any = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        mapped[key] = this.mapIds(data[key]);
      }
    }
    if (mapped._id !== undefined && mapped.id === undefined) {
      mapped.id = mapped._id;
    }
    return mapped;
  }

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
      .pipe(
        timeout(15000),
        retry(1),
        map(res => this.mapIds(res.data))
      );
  }

  post<T>(path: string, body: any): Observable<T> {
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}${path}`, body)
      .pipe(
        timeout(15000),
        map(res => this.mapIds(res.data))
      );
  }

  put<T>(path: string, body: any): Observable<T> {
    return this.http.put<ApiResponse<T>>(`${this.baseUrl}${path}`, body)
      .pipe(
        timeout(15000),
        map(res => this.mapIds(res.data))
      );
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<ApiResponse<T>>(`${this.baseUrl}${path}`)
      .pipe(
        timeout(15000),
        map(res => this.mapIds(res.data))
      );
  }

  getRaw<T>(path: string): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(`${this.baseUrl}${path}`)
      .pipe(
        timeout(15000),
        retry(1),
        map(res => this.mapIds(res))
      );
  }

  postRaw<T>(path: string, body: any): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}${path}`, body)
      .pipe(
        timeout(15000),
        map(res => this.mapIds(res))
      );
  }

  putRaw<T>(path: string, body: any): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(`${this.baseUrl}${path}`, body)
      .pipe(
        timeout(15000),
        map(res => this.mapIds(res))
      );
  }

  deleteRaw<T>(path: string): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(`${this.baseUrl}${path}`)
      .pipe(
        timeout(15000),
        map(res => this.mapIds(res))
      );
  }
}
