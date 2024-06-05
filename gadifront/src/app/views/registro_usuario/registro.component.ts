import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-registro',
  templateUrl: './form_registro_inicial.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {

  onSubmit(): void {
  }


  hide = true;
  clickEvent(event: MouseEvent) {
    this.hide = !this.hide;
    event.stopPropagation();
  }
}