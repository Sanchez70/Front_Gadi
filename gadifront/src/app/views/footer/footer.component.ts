import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
 
  currentExplan: string = '';
  private sidebarSubscription!: Subscription;
  constructor (private authService: AuthService){}
  ngOnInit(): void {
  
    this.sidebarSubscription = this.authService.explan$.subscribe(explan => {
      this.currentExplan = explan;
   
    });
  }
}
