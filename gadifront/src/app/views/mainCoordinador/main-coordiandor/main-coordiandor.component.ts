import { Component } from '@angular/core';
import { AuthService } from '../../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-coordiandor',
  templateUrl: './main-coordiandor.component.html',
  styleUrl: './main-coordiandor.component.css'
})
export class MainCoordiandorComponent {
  currentExplan: string='';
  constructor(private authService:AuthService, private router:Router){
  
  }
    ngOnInit(): void {
      this.authService.explan$.subscribe(explan => {
        this.currentExplan = explan;
      });
    }
}
