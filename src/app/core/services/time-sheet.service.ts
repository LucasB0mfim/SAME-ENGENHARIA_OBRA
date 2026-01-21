import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TimeSheetService {

  private readonly _httpClient = inject(HttpClient);

  private _createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado.');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  findActiveEmployees(): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.get<any>('http://localhost:3000/employee', { headers });
  }

  findEmployeeByChapa(chapa: string): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.get<any>(`http://localhost:3000/timesheet/${chapa}`, { headers });
  }
};
