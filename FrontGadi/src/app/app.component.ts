import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  template: '<router-outlet />',
  standalone: true,
  imports: [RouterOutlet,ReactiveFormsModule]
})
export class AppComponent implements OnInit {
  title = 'CoreUI Angular Admin Template';

  constructor(
    private router: Router,
    private titleService: Title,
    private iconSetService: IconSetService,
  ) {
    this.titleService.setTitle(this.title);
    // iconSet singleton
    this.iconSetService.icons = { ...iconSubset };
  }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });
  }
}
