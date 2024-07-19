import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { JornadaService } from '../../../Services/jornadaService/jornada.service';
import { DistributivoAsignaturaService } from '../../../Services/distributivoAsignaturaService/distributivo-asignatura.service';

@Component({
  selector: 'app-editar-dialog',
  templateUrl: './editar-dialog.component.html',
  styleUrl: './editar-dialog.component.css'
})
export class EditarDialogComponent implements OnInit {
  
  jornadas:any[] = [];
  paralelos: any[] = [];
  id_distributivo_asig: number = 0;
  dialogForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditarDialogComponent>,
    private distributivoAsignaturaService: DistributivoAsignaturaService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    this.paralelos = data.paralelos;
    this.jornadas = data.jornadas;
    this.id_distributivo_asig = data.id_distributivo_asig;
    this.dialogForm = this.fb.group({
      paralelo: ['', Validators.required],
      jornada: ['', Validators.required]
    });


  }

  ngOnInit(): void {
    this.cargarJornadasParalelos();
  }


  cargarJornadasParalelos():void{
    this.distributivoAsignaturaService.getDistributivobyId(this.id_distributivo_asig).subscribe(response=>{
      this.dialogForm.patchValue({
        jornada: response.id_jornada,
        paralelo: response.paralelo
      });
    })
  }
 

  onConfirm(): void {
    this.dialogRef.close(this.dialogForm.value);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
