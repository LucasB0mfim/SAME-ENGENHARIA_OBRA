import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private readonly _httpClient = inject(HttpClient);

  private _createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado.');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  findPendingTaskByChapa(chapa: string) {
    const headers = this._createHeaders();
    return this._httpClient.get<any>(`http://localhost:3000/task/pending/${chapa}`, { headers });
  }

  findHistoryTaskByChapa(chapa: string) {
    const headers = this._createHeaders();
    return this._httpClient.get<any>(`http://localhost:3000/task/history/${chapa}`, { headers });
  }

  create(formData: any) {
    const headers = this._createHeaders();
    return this._httpClient.post<any>('http://localhost:3000/task', formData, { headers });
  }

  update(formData: any) {
    const headers = this._createHeaders();
    return this._httpClient.put<any>('http://localhost:3000/task', formData, { headers });
  }
}
