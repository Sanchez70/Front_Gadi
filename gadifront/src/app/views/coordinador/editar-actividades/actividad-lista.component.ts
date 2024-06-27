import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-actividad-lista',
  template: `
    <h1 mat-dialog-title></h1>
    <button mat-button style="color: #fff; background-color: #ff3a3a;" class="close-button" (click)="close()">X</button>
    <div mat-dialog-content>
      <app-editar-actividades></app-editar-actividades>
    </div>
  `,
  styles: [`
    .close-button {
      position: absolute;
      top: 0;
      right: 0;
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
