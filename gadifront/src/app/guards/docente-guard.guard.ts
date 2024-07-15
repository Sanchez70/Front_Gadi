import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})

export class docenteGuardGuard implements CanActivate  {

   constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.tiporol==='Docente') {
      
      return true;
    } else {
        return false;
    }
  }
};
