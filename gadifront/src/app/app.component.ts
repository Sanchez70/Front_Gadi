import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'gadifront';

  constructor(private authService: AuthService) {
    try {
      if (typeof localStorage !== 'undefined') {
        this.authService.loadUserFromLocalStorage();
      } else {
      }
    } catch (error) {
      throw new Error('Ocurrió un error inesperado. Por favor, inténtalo de nuevo.');
    }
  }
  footer() {
    return this.authService.isLogeado
  }
  rol() {
    return this.authService.tiporol
  }
}
