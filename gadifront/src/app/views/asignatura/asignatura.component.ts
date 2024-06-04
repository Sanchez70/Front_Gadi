import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  public asignaturaDistributivo: DistributivoAsignatura = new DistributivoAsignatura();
  constructor(private asignaturaService: AsignaturaService,private cicloService: CicloService,private carreraService: CarreraService, private jornadaService: JornadaService, private distributivoAsignaturaService: DistributivoAsignaturaService, private router: Router,
    private activatedRoute: ActivatedRoute){

  }

  ngOnInit(): void{
    this.cargarComboCarreras();
    this.cargarComboCiclos();
    this.cargarComboJornada();
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

  cargarAsignaturas(): void{
    this.asignaturaService.getAsignatura().subscribe(data =>{
      this.asignaturas = data;
    });
  }


  onCarreraChange(event:any): void{
    this.carreraSeleccionada = +event.target.value;
    this.idCarrera = this.carreraSeleccionada;
    console.log('id carrera',this.idCarrera)
    this.filtrarAsignaturaCarrerabyCiclo();
  }

  onCicloChange(event:any): void{
    this.cicloSeleccionado = +event.target.value;
    this.idCiclo = this.cicloSeleccionado;
    console.log('id ciclo',this.idCiclo)
    this.filtrarAsignaturaCarrerabyCiclo();
  }

  onJornadaChange(event:any): void{
    this.jornadaSeleccionada = +event.target.value;
    this.idJornada = this.jornadaSeleccionada;
    console.log('id_jornada',this.idJornada);
  }

  onParaleloChange(event:any): void{
    this.paraleloSeleccionado = event.target.value;
    console.log('paralelo',this.paraleloSeleccionado);
  }

  createAsignaturaDistributivo(): void {
    this.asignaturasSeleccionadas.forEach(asignatura => {
      const nuevoAsignaturaDistributivo: DistributivoAsignatura = {
        id_jornada: this.idJornada,
        paralelo: this.paraleloSeleccionado,
        id_distributivo: this.id_distributivo,
        id_asignatura: asignatura.id_asignatura
      };
  
      this.distributivoAsignaturaService.create(nuevoAsignaturaDistributivo).subscribe(response => {
        Swal.fire('Asignatura guardada', `guardado con éxito`, 'success')
        console.log('Asignatura Distributivo generado');
      }, error => {
        Swal.fire('ERROR', `no se ha podido guardar correctamente`, 'warning')
        console.log('Error al crear', error);
      });
    });
  }

  
  filtrarAsignaturaCarrerabyCiclo(): void{
    this.cargarAsignaturas();
    this.asignaturaFiltrada = this.asignaturas.filter(
      (asignatura) => 
        (this.carreraSeleccionada===null || asignatura.id_carrera === this.idCarrera) && 
        (this.cicloSeleccionado===null || asignatura.id_ciclo === this.idCiclo)
    );
    console.log('asignatura filtrada por ciclo',this.asignaturaFiltrada)
  }

  escogerAsignatura(asignatura:Asignatura): void{
    const asignaturaExistente = this.asignaturasSeleccionadas.some(
      (id) => id.id_asignatura === asignatura.id_asignatura
    );
    if(!asignaturaExistente){
      this.asignaturasSeleccionadas.push(asignatura);
      this.calcularHorasTotales();
    }else{
      Swal.fire({
        title: "La asignatura se encuentra seleccionada",
        position: "top-end",
        showConfirmButton: false,
        width: "500px",
        icon: "warning",
        heightAuto: true,
        timer: 1500,
        showClass: {
          popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `
        },
        hideClass: {
          popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `
        }
      });
    }
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

}
