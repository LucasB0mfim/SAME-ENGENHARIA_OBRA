import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EquipmentRentalService {

  private readonly _httpClient = inject(HttpClient);

  private _createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado.');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  send(formData: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.post<any>('https://sameengenharia.com.br/api/equipment-rental/register', formData, { headers });
  }
}
