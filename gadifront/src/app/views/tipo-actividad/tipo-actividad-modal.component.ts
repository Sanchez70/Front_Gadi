import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { tipo_actividad } from '../../Services/tipo_actividadService/tipo_actividad';
import { tipo_actividadService } from '../../Services/tipo_actividadService/tipo_actividad.service';
import Swal from 'sweetalert2';
import { ValidacionesComponent } from '../../validaciones/validaciones.component'; // Asegúrate de ajustar la ruta de importación según la estructura de tu proyecto

@Component({
  selector: 'app-tipo-actividad-modal',
  templateUrl: './tipo-actividad-modal.component.html',
  styleUrls: ['./tipo-actividad-modal.component.css']
})
export class TipoActividadModalComponent {
  public validaciones = ValidacionesComponent;

  constructor(
    public dialogRef: MatDialogRef<TipoActividadModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: tipo_actividad,
    private tipoActividadService: tipo_actividadService
  ) {}

  save(): void {
    if (this.data.nom_tip_actividad.trim() === '') {
      Swal.fire('Error', 'El nombre del tipo de actividad es requerido', 'error');
      return;
    }

    if (!this.validaciones.patternTipoActiValidator().test(this.data.nom_tip_actividad)) {
      return;
    }

    if (this.data.id_tipo_actividad) {
      this.tipoActividadService.update(this.data).subscribe(
        response => {
          Swal.fire('Éxito', 'El tipo de actividad ha sido actualizado', 'success');
          this.dialogRef.close(true);
        },
        error => {
          Swal.fire('Error', 'No se pudo actualizar el tipo de actividad', 'error');
        }
      );
    } else {
      this.tipoActividadService.create(this.data).subscribe(
        response => {
          Swal.fire('Éxito', 'El tipo de actividad ha sido creado', 'success');
          this.dialogRef.close(true);
        },
        error => {
          Swal.fire('Error', 'No se pudo crear el tipo de actividad', 'error');
        }
      );
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
