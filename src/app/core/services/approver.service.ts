import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApproverService {
  private readonly _httpClient = inject(HttpClient);

  private _createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado.');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  findByID(): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.get<any>(`https://sameengenharia.com.br/api/purchase-order/findById`, { headers });
  }

  findByOC(): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.get<any>(`https://sameengenharia.com.br/api/purchase-order/findByOc`, { headers });
  }

  findByContract(): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.get<any>(`https://sameengenharia.com.br/api/purchase-order/findByContract`, { headers });
  }

  approve(request: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.post<any>(`https://sameengenharia.com.br/api/purchase-order/approve`, request, { headers });
  }
}
