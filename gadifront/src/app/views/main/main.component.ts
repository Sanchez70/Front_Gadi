import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit{ 
  currentExplan: string='';
constructor(private authService:AuthService, private router:Router){

}
  ngOnInit(): void {
    this.authService.explan$.subscribe(explan => {
      this.currentExplan = explan;
    });
  }


}
