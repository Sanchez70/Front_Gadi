import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Carrera } from '../../Services/carreraService/carrera';
import { CarreraService } from '../../Services/carreraService/carrera.service';
@Component({
    selector: 'app-carrera-modal',
    templateUrl: './carrera-modal.component.html',
    styleUrls: ['./carrera.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarreraModalComponent implements OnInit {
    carreraForm: FormGroup;


    constructor(
        public dialogRef: MatDialogRef<CarreraModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Carrera,
        private fb: FormBuilder,
        private carreraService: CarreraService
    ) {
        this.carreraForm = this.fb.group({
            nombre_carrera: [data?.nombre_carrera || '', Validators.required],
            fecha_inicio: [data?.fecha_inicio || '', Validators.required],
            horas_semanales: [data?.horas_semanales || 0, [Validators.required, Validators.min(1)]],
            codigo: [data?.codigo || '', Validators.required]
        });
    }

    ngOnInit(): void { }

    onSave(): void {
        if (this.carreraForm.valid) {
            const carrera = { ...this.data, ...this.carreraForm.value };
            if (carrera.id_carrera) {
                this.carreraService.update(carrera).subscribe(() => this.dialogRef.close(true));
            } else {
                this.carreraService.create(carrera).subscribe(() => this.dialogRef.close(true));
            }
        }
    }

    onCancel(): void {
        this.dialogRef.close();
    }
}