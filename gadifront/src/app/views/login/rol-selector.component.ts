import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Rol } from '../../Services/rol/rol';

@Component({
  selector: 'app-role-dialog',
  templateUrl: './rol-selector.component.html',
  styleUrl: './rol-selector.component.css',
})
export class RolSelectorComponent {
  roles: Rol[];
  roleForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<RolSelectorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.roles = data.roles;
    this.roleForm = this.fb.group({
      selectedRole: [null]
    });
  }

  onConfirm(): void {
    this.dialogRef.close(this.roleForm.value.selectedRole);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
