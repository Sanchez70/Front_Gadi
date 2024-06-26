import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Asignatura } from '../../Services/asignaturaService/asignatura';
import { AsignaturaService } from '../../Services/asignaturaService/asignatura.service';
import { CarreraService } from '../../Services/carreraService/carrera.service';
import { CicloService } from '../../Services/cicloService/ciclo.service';

@Component({
    selector: 'app-asignatura-modal',
    templateUrl: './asignatura-modal.component.html',
    styleUrls: ['./crud-asignatura.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AsignaturaModalComponent implements OnInit {
    asignaturaForm: FormGroup;
    public carreraSelec: number = 0;
    public id_carrera: number = 0;
    public carreras: any[] = [];
    public cicloSelec: number = 0;
    public id_ciclo: number = 0;
    public ciclos: any[] = [];

    constructor(
        public dialogRef: MatDialogRef<AsignaturaModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Asignatura,
        private fb: FormBuilder,
        private asignaturaService: AsignaturaService,
        private carreraService: CarreraService,
        private cicloService: CicloService
    ) {
        this.asignaturaForm = this.fb.group({
            nombre_asignatura: [data?.nombre_asignatura || '', Validators.required],
            horas_semanales: [data?.horas_semanales || "", [Validators.required, Validators.min(1)]],
            id_carrera: [data?.id_carrera || 0, Validators.required],
        id_ciclo: [data?.id_ciclo || 0, Validators.required]
        });
    }

    ngOnInit(): void {
        this.loadCarrera();
        this.loadCiclo();
     }

    onSave(): void {
        if (this.asignaturaForm.valid) {
            const asignatura = { ...this.data, ...this.asignaturaForm.value };
            if (asignatura.id_asignatura) {
                this.asignaturaService.update(asignatura).subscribe(() => this.dialogRef.close(true));
            } else {
                this.asignaturaService.create(asignatura).subscribe(() => this.dialogRef.close(true));
            }
        }
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    loadCarrera() {
        this.carreraService.getCarrera().subscribe(data => {
            this.carreras = data;
        })
    }
    onCarreraChange(event: any): void {
        this.carreraSelec = +event.value;
        this.asignaturaForm.get('id_carrera')?.setValue(this.carreraSelec);
    }

    loadCiclo() {
        this.cicloService.getCiclo().subscribe(data => {
            this.ciclos = data;
        })
    }
    onCicloChange(event: any): void {
        this.cicloSelec = +event.value;
        this.asignaturaForm.get('id_ciclo')?.setValue(this.cicloSelec);
    }
}