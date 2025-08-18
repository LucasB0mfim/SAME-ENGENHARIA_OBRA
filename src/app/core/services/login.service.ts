import { map, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private readonly _httpClient = inject(HttpClient);
  private readonly _router = inject(Router);

  login(request: any): Observable<any> {
    return this._httpClient.post<any>('http://localhost:3000/auth/employee/login', request).pipe(
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
