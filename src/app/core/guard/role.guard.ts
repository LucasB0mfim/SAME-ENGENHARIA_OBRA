import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { UserService } from '../services/user.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const _router = inject(Router);
  const _userService = inject(UserService);

  const allowedRoles: string[] = route.data['allowedRoles'] || [];

  return _userService.getInfo().pipe(
    map(res => {

      const userRole = res.result.funcao || res.result.setor;

      if (allowedRoles.includes(userRole)) {
        return true;
      } else {
        alert("Acesso negado!");
        _router.navigate(['/dashboard/home']);
        return false;
      }
    }),
    catchError(() => {
      alert("Não foi possível te identificar. Faça login novamente!")
      _router.navigate(['/dashboard/home']);
      return of(false);
    })
  );
};
