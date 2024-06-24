import { Component } from '@angular/core';
import { AuthService } from '../../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-docente',
  templateUrl: './main-docente.component.html',
  styleUrl: './main-docente.component.css'
})
export class MainDocenteComponent {
  currentExplan: string='';
  constructor(private authService:AuthService, private router:Router){
  
  }
    ngOnInit(): void {
      this.authService.explan$.subscribe(explan => {
        this.currentExplan = explan;
      });
      
    }
}
