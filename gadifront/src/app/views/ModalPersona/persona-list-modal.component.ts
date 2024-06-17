import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PersonaModalComponent } from './persona-modal.component';

@Component({
  selector: 'app-persona-list-modal',
  template: `
    <h1 mat-dialog-title></h1>
    <div mat-dialog-actions class="actions-container">
      <button mat-button (click)="close()" class="close-button">Cerrar</button>
    </div>
    <div mat-dialog-content>
      <app-Modal-persona></app-Modal-persona>
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
})
export class PersonaListModalComponent {
  constructor(public dialogRef: MatDialogRef<PersonaListModalComponent>) {}

  close(): void {
    this.dialogRef.close();
  }
}
