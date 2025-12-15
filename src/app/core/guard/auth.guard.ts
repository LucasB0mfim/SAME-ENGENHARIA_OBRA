import { map } from 'rxjs';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export const authGuard: CanActivateFn = (route, state) => {

  function _createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado.');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  const body = '';
  const _router = inject(Router);
  const headers = _createHeaders();
  const _httpClient = inject(HttpClient);

  return _httpClient.post<any>('https://sameengenharia.com.br/api/cuser/auth-token', body, { headers }).pipe(
    map(response => {
      if (response.success) {
        return true
      } else {
        _router.navigate(['']);
        return false;
      }
    })
  )
}
