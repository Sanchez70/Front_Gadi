import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonaService } from '../../Services/personaService/persona.service';
import { AuthService } from '../../auth.service';
import { TituloProfesionalService } from '../../Services/titulo/titulo-profesional.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-titulo-profesional',
  templateUrl: './titulo-profesional.component.html',
  styleUrls: ['./titulo-profesional.component.css']
})
export class TituloProfesionalComponent implements OnInit {

  tituloForm!: FormGroup;

  constructor(private router: Router, private authService: AuthService,private fb: FormBuilder,private tituloService: TituloProfesionalService) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    const idPersona = this.authService.id_persona;
    this.tituloForm = this.fb.group({
      id_persona: [idPersona, Validators.required],
      grado: ['', Validators.required],
      nombre_titulo: ['', Validators.required]
    });
  }

  guardarTitulo(): void {
    if (this.tituloForm.valid) {
      this.tituloService.create(this.tituloForm.value).subscribe(
        response => {
          this.router.navigate(['./persona/form']);
          console.log('Título guardado exitosamente', response);
          // Aquí puedes manejar la respuesta del servidor
        },
        error => {
          console.error('Error al guardar el título', error);
          // Aquí puedes manejar los errores de la solicitud
        }
      );
    } else {
      console.log('Formulario no válido');
    }
  }}
