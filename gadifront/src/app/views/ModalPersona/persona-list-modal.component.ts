import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-persona-list-modal',
  template: `
    <h1 mat-dialog-title></h1>
    <button mat-button style="color: #fff; background-color: #ff3a3a;" (click)="close()" class="close-button">X</button>
    <div mat-dialog-content>
      <app-Modal-persona (personaSeleccionada)="emitirSeleccion($event)"></app-Modal-persona>
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
export class PersonaListModalComponent {
  @Output() personaSeleccionada = new EventEmitter<string>();

  constructor(public dialogRef: MatDialogRef<PersonaListModalComponent>) { }

  close(): void {
    this.dialogRef.close();
  }

  emitirSeleccion(cedula: string) {
    this.personaSeleccionada.emit(cedula);
    this.dialogRef.close();
  }
}
