import { Component, OnInit } from '@angular/core';
import { Persona } from '../../Services/docenteService/persona';
import { Titulo_profesional } from '../../Services/titulo/titulo_profesional';
import { Tipo_contrato } from '../../Services/tipo_contrato/tipo_contrato';
import { TipoContratoService } from '../../Services/tipo_contrato/tipo-contrato.service';
import { Grado_ocupacional } from '../../Services/grado/grado_ocupacional';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { RegistroService } from '../../Services/registroService/registro.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './form_registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  public registroForm1: FormGroup;
  public registroForm2: FormGroup;
  public edad: number = 0;

  public persona: Persona = new Persona();
  public titulo: Titulo_profesional = new Titulo_profesional();
  public contratos: any[] = [];
  public grado: Grado_ocupacional = new Grado_ocupacional();

  showFinalForm: boolean = false;
  public isTiempoParcial: boolean = false;

  constructor(private router: Router, private fb: FormBuilder, private service: RegistroService, private tipoContratoService: TipoContratoService) {
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
      fecha_nacimiento: ['', Validators.required],
      edad: ['', Validators.required],
      fecha_vinculacion: ['', Validators.required],
      titulos: this.fb.array([]),
      grado: ['', Validators.required],
      nombre_grado_ocp: ['', Validators.required],
      nombre_contrato: ['', Validators.required],
      hora_contrato: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {
    this.loadContratos();
  }

  loadContratos() {
    this.tipoContratoService.getContrato().subscribe(data => {
      this.contratos = data;
    });
  }

  get titulos() {
    return this.registroForm2.get('titulos') as FormArray;
  }

  addTitulo() {
    const tituloForm = this.fb.group({
      nombre_titulo: ['', Validators.required],
      grado: ['', Validators.required]
    });
    this.titulos.push(tituloForm);
  }

  removeTitulo(index: number) {
    this.titulos.removeAt(index);
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
    if (this.registroForm2.invalid || this.edad < 18) {
      this.registroForm2.markAllAsTouched();
      return;
    } else {
      this.service.createPer(this.persona)
        .subscribe(persona => {
          this.router.navigate(['/persona']);
          Swal.fire(`Registro exitoso`, '', 'success');
        });

      this.router.navigate(['./login']);
    }
  }

  calcularEdad(event: any): void {
    const fechaNacimiento = new Date(event.target.value);
    const fechaActual = new Date();
    let edad = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
    const mes = fechaActual.getMonth() - fechaNacimiento.getMonth();

    if (mes < 0 || (mes === 0 && fechaActual.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }

    this.edad = edad;
    this.registroForm2.get('edad')?.setValue(edad);
  }

  onContratoChange(event: any) {
    const selectedContrato = event.target.value;
    this.isTiempoParcial = selectedContrato === 'Tiempo Parcial';
    if (!this.isTiempoParcial) {
      this.registroForm2.get('hora_contrato')?.reset();
    }
  }
}
