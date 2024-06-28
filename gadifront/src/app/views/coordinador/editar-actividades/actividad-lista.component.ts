import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-actividad-lista',
  template: `
    <h1 mat-dialog-title></h1>
   
    <div class=".dialog-content" mat-dialog-content style="width: 100%, height: 100%;">
    <app-editar-actividades style="width: 100%; height: 100%;"></app-editar-actividades>
    </div>
  `,
  styles: [`
    .close-button {
      position: absolute;
      top: 0;
      right: 0;
    }
    .dialog-content {
      width: 100%;
      height: 100%;
    }
  `],
})
export class ActividadListaComponent {
  @Output() personaSeleccionada = new EventEmitter<string>();

  constructor(public dialogRef: MatDialogRef<ActividadListaComponent>) { }

  close(): void {
    this.dialogRef.close();
  }
}
