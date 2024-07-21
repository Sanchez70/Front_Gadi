import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { PersonaService } from '../../Services/personaService/persona.service';
import { Usuario } from '../../Services/loginService/usuario';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidacionesComponent } from '../../validaciones/validaciones.component';

@Component({
  selector: 'app-docentecontra-modal',
  templateUrl: './docentecontra-modal.component.html',
  styleUrls: ['./docentecontra-modal.component.css']
})
export class DocenteContraComponentModalComponent {
  passwordForm: FormGroup;
  passwordPattern = ValidacionesComponent.patternPasswordValidator();
  hide = true;

  constructor(
    public dialogRef: MatDialogRef<DocenteContraComponentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { usuario: Usuario },
    private personaService: PersonaService,
    private fb: FormBuilder
  ) {
    this.passwordForm = this.fb.group({
      newPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(this.passwordPattern)
        ]
      ]
    });
  }

  save(): void {
    if (this.passwordForm.invalid) {
      
      return;
    }

    const newPassword = this.passwordForm.get('newPassword')?.value;
    const updatedUsuario: Usuario = { ...this.data.usuario, contrasena: newPassword };

    this.personaService.updateUsuario(updatedUsuario).subscribe(
      response => {
        Swal.fire('Éxito', 'La contraseña ha sido actualizada', 'success');
        this.dialogRef.close(true);
      },
      error => {
        Swal.fire('Error', 'No se pudo actualizar la contraseña', 'error');
      }
    );
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
