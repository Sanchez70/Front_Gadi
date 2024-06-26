import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Periodo } from '../../Services/periodoService/periodo';
import { PeriodoService } from '../../Services/periodoService/periodo.service';

interface Estado {
    value: string;
    viewValue: string;
}
@Component({
    selector: 'app-periodo-modal',
    templateUrl: './periodo-modal.component.html',
    styleUrls: ['./periodo.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeriodoModalComponent implements OnInit {
    periodoform: FormGroup;
    estados: Estado[] = [
        { value: 'Activo', viewValue: 'Activo' },
        { value: 'Inactivo', viewValue: 'Inactivo' },
    ];
    constructor(
        public dialogRef: MatDialogRef<PeriodoModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Periodo,
        private fb: FormBuilder,
        private periodoService: PeriodoService
    ) {
        this.periodoform = this.fb.group({
            nombre_periodo: [data?.nombre_periodo || '', Validators.required],
            inicio_periodo: [data?.inicio_periodo || '', Validators.required],
            fin_periodo: [data?.fin_periodo || '', [Validators.required]],
            estado: [data?.estado || '', Validators.required]
        });
    }

    ngOnInit(): void { }

    onSave(): void {
        if (this.periodoform.valid) {
            const periodo = { ...this.data, ...this.periodoform.value };
            if (periodo.id_periodo) {
                this.periodoService.update(periodo).subscribe(() => this.dialogRef.close(true));
            } else {
                this.periodoService.create(periodo).subscribe(() => this.dialogRef.close(true));
            }
        }
    }

    onCancel(): void {
        this.dialogRef.close();
    }
}