import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class adminGuardGuard implements CanActivate  {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.tiporol==='Administrador') {
   
      return true;
    } else {
        return false;
    }
  }
};
