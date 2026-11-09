import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api.tokens';
import {
  ApiResponse,
  DefaultApiPayload,
  QueryParams,
} from './api.types';

export abstract class ApiClient<TEntity> {
  protected abstract readonly endpoint: string;

  protected readonly http = inject(HttpClient);
  protected readonly baseUrl = inject(API_BASE_URL);

  protected get resourceUrl(): string {
    return `${this.baseUrl}/${this.endpoint}`;
  }

  get<TEntityResponse = TEntity>(
    params?: QueryParams
  ): Observable<TEntityResponse> {
    return this.http.get<TEntityResponse>(this.resourceUrl, {
      params: this.buildParams(params),
    });
  }

  getById<TEntityResponse = TEntity>(
    id: number | string
  ): Observable<ApiResponse<TEntityResponse>> {
    return this.http.get<ApiResponse<TEntityResponse>>(
      `${this.resourceUrl}/${id}`
    );
  }

  getByIdList<
    TEntityResponse = TEntity,
    TPayload extends Record<string, unknown> = DefaultApiPayload<TEntityResponse>
  >(id: number | string): Observable<ApiResponse<TEntityResponse, TPayload>> {
    return this.http.get<ApiResponse<TEntityResponse, TPayload>>(
      `${this.resourceUrl}/${id}`
    );
  }

  post<TEntityResponse = TEntity, TCreatePayload = Partial<TEntity>>(
    body: TCreatePayload
  ): Observable<TEntityResponse> {
    return this.http.post<TEntityResponse>(this.resourceUrl, body);
  }

  put<TEntityResponse = TEntity, TUpdatePayload = Partial<TEntity>>(
    id: number | string,
    body: TUpdatePayload
  ): Observable<TEntityResponse> {
    return this.http.put<TEntityResponse>(`${this.resourceUrl}/${id}`, body);
  }

  patch<TEntityResponse = TEntity, TUpdatePayload = Partial<TEntity>>(
    id: number | string,
    body: TUpdatePayload
  ): Observable<TEntityResponse> {
    return this.http.patch<TEntityResponse>(`${this.resourceUrl}/${id}`, body);
  }

  delete<TEntityResponse = void>(
    id: number | string
  ): Observable<TEntityResponse> {
    return this.http.delete<TEntityResponse>(`${this.resourceUrl}/${id}`);
  }

  protected buildParams(params?: QueryParams): HttpParams {
    let httpParams = new HttpParams();

    for (const [key, value] of Object.entries(params ?? {})) {
      if (value !== null && value !== undefined) {
        httpParams = httpParams.set(key, String(value));
      }
    }

    return httpParams;
  }
}