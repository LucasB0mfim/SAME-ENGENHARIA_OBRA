import { map, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private readonly _router = inject(Router);
  private readonly _httpClient = inject(HttpClient);

  loginByUsername(request: any): Observable<any> {
    return this._httpClient.post<any>('https://sameengenharia.com.br/api/user/login/username', request).pipe(
      map((response) => {
        if (response.success) {
          localStorage.setItem('token', response.token);
        } else {
          return response;
        }
      })
    );
  };

  loginByCPF(request: any): Observable<any> {
    return this._httpClient.post<any>('https://sameengenharia.com.br/api/user/login/cpf', request).pipe(
      map((response) => {
        if (response.success) {
          localStorage.setItem('token', response.token);
        } else {
          return response;
        }
      })
    );
  };

  logout() {
    localStorage.removeItem('token');
    this._router.navigate(['/login']);
  }
};
