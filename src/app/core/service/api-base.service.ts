import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HeaderRequest } from '../interfaces/header-request.interface';
import { ErrorResponse } from '../interfaces/error-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiBaseService {
  constructor(private httpClient: HttpClient) {}

  get<T>(url: string, headers?: Array<HeaderRequest>, queryParams?: any): any {
    return this.httpClient
      .get<T>(url, {
        headers: this.getHeaderRequest(headers),
        params: queryParams as any,
        observe: 'response',
      })
      .pipe(
        catchError((errorHttpResponse) => this.handleError(errorHttpResponse))
      );
  }

  post<T>(
    url: string,
    headers?: Array<HeaderRequest>,
    data?: any,
    queryParams?: any
  ): any {
    return this.httpClient
      .post<T>(url, data, {
        headers: this.getHeaderRequest(headers),
        params: queryParams as any,
        observe: 'response',
      })
      .pipe(
        catchError((errorHttpResponse) => this.handleError(errorHttpResponse))
      );
  }

  put<T>(
    url: string,
    headers?: Array<HeaderRequest>,
    data?: any,
    queryParams?: any
  ): any {
    return this.httpClient
      .put<T>(url, data, {
        headers: this.getHeaderRequest(headers),
        params: queryParams as any,
        observe: 'response',
      })
      .pipe(
        catchError((errorHttpResponse) => this.handleError(errorHttpResponse))
      );
  }

  delete<T>(url: string, headers?: Array<HeaderRequest>, data?: any): any {
    return this.httpClient
      .delete<T>(url, {
        headers: this.getHeaderRequest(headers),
        body: data,
        observe: 'response',
      })
      .pipe(
        catchError((errorHttpResponse) => this.handleError(errorHttpResponse))
      );
  }

  private handleError(errorHttpResponse: HttpErrorResponse): any {
    const apiError: ErrorResponse = {
      status: errorHttpResponse.status,
      error: [
        {
          code: `${errorHttpResponse.status}`,
          message: errorHttpResponse.error,
        },
      ],
    };

    return throwError(apiError);
  }

  private getHeaderRequest(headers?: Array<HeaderRequest>): HttpHeaders {
    let httpHeaders: HttpHeaders = new HttpHeaders();

    if (headers) {
      headers.forEach(
        ({ key, value }) =>
          (httpHeaders =
            key != null && value != null
              ? httpHeaders.set(key, value)
              : httpHeaders)
      );
    }

    return httpHeaders;
  }
}
