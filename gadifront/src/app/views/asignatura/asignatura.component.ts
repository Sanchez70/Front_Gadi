import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Asignatura } from '../../Services/asignaturaService/asignatura';
import { DistributivoAsignatura } from '../../Services/distributivoAsignaturaService/distributivo-asignatura';
import { AsignaturaService } from '../../Services/asignaturaService/asignatura.service';
import { Ciclo } from '../../Services/cicloService/ciclo';
import { CicloService } from '../../Services/cicloService/ciclo.service';
import { Carrera } from '../../Services/carreraService/carrera';
import { CarreraService } from '../../Services/carreraService/carrera.service';
import { JornadaService } from '../../Services/jornadaService/jornada.service';
import { DistributivoAsignaturaService } from '../../Services/distributivoAsignaturaService/distributivo-asignatura.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../auth.service';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

const Toast = Swal.mixin({
  toast: true,
  position: "bottom-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});
@Component({
  selector: 'app-asignatura',
  templateUrl: './asignatura.component.html',
  styleUrl: './asignatura.component.css'
})
export class AsignaturaComponent implements OnInit {
  carreras: any[] = [];
  carreraSeleccionada: number = 0;
  asignaturas: any[] = [];
  asignaturaFiltrada: any[] = [];
  paralelos: string[] = ['A','B'];
  paraleloSeleccionado: string = '';
  jornadas: any[] = [];
  jornadaSeleccionada: number = 0;
  idJornada: number = 0;
  asignaturasSeleccionadas: Asignatura[] = [];
  nombreCiclo : string = '';
  horasTotales: number = 0;
  idCarrera : number = 0;
  idCiclo : number = 0;
  ciclos: any[] = [];
  cicloSeleccionado:  number = 0;
  id_distributivo= 1;
  currentExplan: string='';
  myForm: FormGroup = this.fb.group({});

  
  public asignaturaDistributivo: DistributivoAsignatura = new DistributivoAsignatura();
  constructor(private asignaturaService: AsignaturaService,
    private cicloService: CicloService,
    private carreraService: CarreraService, 
    private jornadaService: JornadaService, 
    private distributivoAsignaturaService: DistributivoAsignaturaService, 
    private authService: AuthService, 
    private router: Router,
    private activatedRoute: ActivatedRoute, 
    private fb: FormBuilder,
    private dialog: MatDialog
  ){

  }

  ngOnInit(): void{
    this.authService.explan$.subscribe(explan => {
      this.currentExplan = explan;
    });
    this.cargarComboCarreras();
    this.cargarComboCiclos();
    this.cargarComboJornada();
    this.idCarrera = this.authService.id_carrera;
    
    this.myForm = this.fb.group({
      paraleloSeleccionado: [null, Validators.required],
      cicloSeleccionado: [null, Validators.required]
    })
  }

  cargarComboCarreras(): void {
    this.carreraService.getCarrera().subscribe(data => {
      this.carreras = data;
    });

  }

  cargarComboCiclos(): void{
    this.cicloService.getCiclo().subscribe(data => {
      this.ciclos = data;
    });
  }

  cargarComboJornada(): void{
    this.jornadaService.getJornada().subscribe(data =>{
      this.jornadas = data;
    });
  }

  cargarAsignaturas(): Observable<void> {
    return new Observable(observer => {
        this.asignaturaService.getAsignatura().subscribe(data => {
            this.asignaturas = data;
            observer.next();
            observer.complete();
        });
    });
}

  onCicloChange(event:any): void{
    this.cicloSeleccionado = +event.target.value;
    this.idCiclo = this.cicloSeleccionado;
    this.filtrarAsignaturaCarrerabyCiclo();
    this.myForm.get('cicloSeleccionado')?.setValue(event.target.value);
  }

  onJornadaChange(event:any): void{
    this.jornadaSeleccionada = +event.target.value;
    this.idJornada = this.jornadaSeleccionada;
  }

  onParaleloChange(event:any): void{
    this.paraleloSeleccionado = event.target.value;
    this.myForm.get('paraleloSeleccionado')?.setValue(event.target.value);
  }
  
  filtrarAsignaturaCarrerabyCiclo(): void{
    this.cargarAsignaturas().subscribe(()=>{
      this.asignaturaFiltrada = this.asignaturas.filter(
        (asignatura) => 
          (asignatura.id_carrera === this.idCarrera) && 
          (this.cicloSeleccionado===null || asignatura.id_ciclo === this.idCiclo)
      );
    }); 
  }

  escogerAsignatura(asignatura:Asignatura): void{
    const asignaturaExistente = this.asignaturasSeleccionadas.some(
      (id) => id.id_asignatura === asignatura.id_asignatura
    );
   
      this.asignaturasSeleccionadas.push(asignatura);
      this.calcularHorasTotales();
  }

  eliminarAsignatura(fila:number): void{
    this.asignaturasSeleccionadas.splice(fila,1);
    this.calcularHorasTotales()
  }

  calcularHorasTotales():void{
    this.horasTotales = this.asignaturasSeleccionadas.reduce(
      (sum,asignatura) => sum + asignatura.horas_semanales, 0
    );
  }

  obtenerNombreCiclo(id_ciclo:number):void{
    const ciclo = this.ciclos.find(ciclo => ciclo.id_ciclo === id_ciclo);
    return ciclo ? ciclo.nombre_ciclo : '';
  }

  enviarAsignaturas():void{
    if (this.myForm.valid){
      this.authService.clearLocalStorageAsignatura();
      this.authService.id_asignaturas = this.asignaturasSeleccionadas;
      this.authService.id_jornada = this.jornadaSeleccionada;
      this.authService.paralelo = this.paraleloSeleccionado;
      this.authService.saveUserToLocalStorage();
      this.router.navigate(['./distributivo']);
    }else{
      Toast.fire({
        icon: "warning",
        title: "Por favor, seleccione una opción",
      });
    }
    
  }
}