import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-registro',
  templateUrl: './form_registro_inicial.component.html', 
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {

  name1: string="";
  name2: string="";
  lastname1: string="";
  lastname2: string="";
  user: string="";
  password: string="";  

  showFinalForm: boolean = false;

  onSubmit1(): void {
    localStorage.setItem('registroData', JSON.stringify({
      primer_nombre: this.name1,
      segundo_nombre: this.name2,
      primer_apellido: this.lastname1,
      segundo_apellido: this.lastname2,
      usuario: this.user,
      password: this.password
    }));

    this.showFinalForm = true;
  }

  onSubmit2(): void {

  }

}