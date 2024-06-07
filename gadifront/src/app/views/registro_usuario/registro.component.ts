import { Component } from '@angular/core';
import { Persona } from '../../Services/docenteService/persona';
import { Titulo_profesional } from '../../Services/titulo/titulo_profesional';
import { Tipo_contrato } from '../../Services/tipo_contrato/tipo_contrato';
import { Grado_ocupacional } from '../../Services/grado/grado_ocupacional';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistroService } from '../../Services/registroService/registro.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-registro',
  templateUrl: './form_registro_inicial.component.html', // Actualizamos esto para usar una plantilla única
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  public registroForm1: FormGroup;
  public registroForm2: FormGroup;
  name1: string = "";
  name2: string = "";
  lastname1: string = "";
  lastname2: string = "";
  user: string = "";
  password: string = "";

  public persona:Persona = new Persona()
  public titulo:Titulo_profesional = new Titulo_profesional()
  public contrato:Tipo_contrato = new Tipo_contrato()
  public grado:Grado_ocupacional = new Grado_ocupacional()

  showFinalForm: boolean = false;

  constructor( private router: Router, private fb: FormBuilder, private service:RegistroService) {

    this.registroForm1 = this.fb.group({
      name1: ['', Validators.required],
      name2: ['', Validators.required],     
      lastname1: ['', Validators.required],
      lastname2: ['', Validators.required],
      user: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.registroForm2 = this.fb.group({
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      edad: ['', Validators.required],
      fecha_vinculacion: ['', Validators.required],
      nombre_titulo: ['', Validators.required],
      grado: ['', Validators.required],
      nombre_grado_ocp: ['', Validators.required],
      nombre_contrato: ['', Validators.required],
      hora_contrato: ['', [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit1(): void {

    if (this.registroForm1.invalid) {
      this.registroForm1.markAllAsTouched();
      return;
    }

    const { name1, name2, lastname1, lastname2, user, password } = this.registroForm1.value;

    localStorage.setItem('registroData', JSON.stringify({
      primer_nombre: name1,
      segundo_nombre: name2,
      primer_apellido: lastname1,
      segundo_apellido: lastname2,
      usuario: user,
      password: password
    }));

    this.showFinalForm = true;
  }

  onSubmit2(): void {

    if (this.registroForm2.invalid) {
      this.registroForm2.markAllAsTouched();
      return;
    }else{
      this.service.createPer(this.persona)
    .subscribe(persona => {
        this.router.navigate(['/persona'])
        Swal.fire(`Registro exitoso`, '', 'success')
      }
    )
      
    this.router.navigate(['./login']);
    }


    
  }
}
