import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonaService } from '../persona/persona.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-creacion',
  templateUrl: './admin-creacion.component.html',
  styleUrls: ['./admin-creacion.component.css'],
  standalone: true,
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSnackBarModule,
    ReactiveFormsModule,
  ],
})
export class AdminCreacionComponent implements OnInit {
  searchForm: FormGroup;
  personaForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private personaService: PersonaService,
    private snackBar: MatSnackBar
  ) {
    this.searchForm = this.fb.group({
      cedula: ['', Validators.required],
    });

    this.personaForm = this.fb.group({
      nombre1: [{ value: '', disabled: true }],
      nombre2: [{ value: '', disabled: true }],
      apellido1: [{ value: '', disabled: true }],
      apellido2: [{ value: '', disabled: true }],
      telefono: [{ value: '', disabled: true }],
      direccion: [{ value: '', disabled: true }],
      correo: [{ value: '', disabled: true }],
      edad: [{ value: '', disabled: true }],
      fecha_vinculacion: [{ value: '', disabled: true }],
      tipo_contrato: [{ value: '', disabled: true }],
      titulo_profesional: [{ value: '', disabled: true }],
      grado_ocupacional: [{ value: '', disabled: true }],
      nombre_usuario: [{ value: '', disabled: true }],
    });
  }

  ngOnInit(): void {}

  buscarPersona() {
    const cedula = this.searchForm.get('cedula')?.value;
    if (cedula) {
      this.personaService.getPersonaByCedula(cedula).subscribe(
        (persona) => {
          if (persona) {
            this.personaForm.patchValue(persona);
            this.snackBar.open('Persona Encontrada', 'Cerrar', {
              duration: 3000,
            });
          } else {
            this.snackBar.open('No se encontró la persona', 'Cerrar', {
              duration: 3000,
            });
          }
        },
        (error) => {
          this.snackBar.open('No se encontró la persona', 'Cerrar', {
            duration: 3000,
          });
        }
      );
    }
  }
}
