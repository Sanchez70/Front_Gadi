import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth.service';



@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {

  constructor(private inicio: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.inicio.isLogeado) {
      return false;
    }
    return true;
  } 
}