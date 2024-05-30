import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit{ 
  currentExplan: string='';
constructor(private authService:AuthService){

}
  ngOnInit(): void {
    this.authService.explan$.subscribe(explan => {
      this.currentExplan = explan;
      // Aquí puedes manejar cualquier otra lógica cuando `explan` cambie
    });
  }

}
