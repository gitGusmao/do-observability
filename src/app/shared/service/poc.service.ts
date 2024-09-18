import { Injectable } from '@angular/core';
import { ApiBaseService } from '../../core/service/api-base.service';
import { environment } from '../../../environments/environment.prod';
import { resources } from '../../../environments/resources';

@Injectable({
  providedIn: 'root',
})
export class PocsService {
  protected baseApi = environment.baseApi;

  constructor(private apiBase: ApiBaseService) {}

  query(value: any) {
    const uri: string = `${resources.poc.query}`;
    return this.apiBase.post(`${this.baseApi + uri}`, undefined, value);
  }
}
