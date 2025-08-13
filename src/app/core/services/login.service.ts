import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private readonly _httpClient = inject(HttpClient);

  login(request: any): Observable<any> {
    return this._httpClient.post<any>('https://sameengenharia.com.br/api/auth/employee/login', request).pipe(
      map((response) => {
        if (response.success) {
          localStorage.setItem('token', response.token);
        } else {
          return response;
        }
      })
    );
  };
};
