import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @ViewChild('sidenav')
  sidenav!: MatSidenav;

  constructor() { }

  toggleSidenav() {
    this.sidenav.toggle();
  }
}
