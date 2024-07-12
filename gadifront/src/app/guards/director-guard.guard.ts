import { Injectable } from '@angular/core';
import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';
@Injectable({
  providedIn: 'root'
})

export class directorGuardGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.tiporol==='Director') {
   
      return true;
    } else {
        return false;
    }
  }
};
