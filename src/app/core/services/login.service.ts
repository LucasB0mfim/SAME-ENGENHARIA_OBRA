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

  logout() {
    localStorage.removeItem('token');
    this._router.navigate(['/login']);
  }
};
