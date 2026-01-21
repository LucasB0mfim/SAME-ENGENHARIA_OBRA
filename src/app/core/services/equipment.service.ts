import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  private readonly _httpClient = inject(HttpClient);

  private _createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado.');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  send(formData: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.post<any>('http://localhost:3000/equipment-rental/register', formData, { headers });
  }

  findAll() {
    const headers = this._createHeaders();
    return this._httpClient.get<any>('http://localhost:3000/equipament', { headers });
  }

  register(formData: any) {
    const headers = this._createHeaders();
    return this._httpClient.post<any>('http://localhost:3000/equipament/register', formData, { headers });
  }

  checkin(formData: any) {
    const headers = this._createHeaders();
    return this._httpClient.put<any>('http://localhost:3000/equipament/checkin', formData, { headers });
  }

  checkout(formData: any) {
    const headers = this._createHeaders();
    return this._httpClient.put<any>('http://localhost:3000/equipament/checkout', formData, { headers });
  }
}
