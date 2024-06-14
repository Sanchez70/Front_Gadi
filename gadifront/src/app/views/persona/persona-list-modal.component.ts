import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TablaComponent } from '../tabla/tabla.component';

@Component({
  selector: 'app-persona-list-modal',
  template: `
    <h1 mat-dialog-title>Lista de Personas</h1>
    <div mat-dialog-actions class="actions-container">
      <button mat-button (click)="close()" class="close-button">Cerrar</button>
    </div>
    <div mat-dialog-content>
      <app-tabla></app-tabla>
    </div>
    
  `,
  styles: [`
    .actions-container {
      position: relative;
      top: -9%
    }
    .close-button {
      position: absolute;
      top: 0;
      right: 0;
    }
  `],
  standalone: true,
  imports: [TablaComponent]
})
export class PersonaListModalComponent {
  constructor(public dialogRef: MatDialogRef<PersonaListModalComponent>) {}

  close(): void {
    this.dialogRef.close();
  }
}
