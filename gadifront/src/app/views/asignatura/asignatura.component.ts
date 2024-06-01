import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Asignatura } from '../../Services/asignaturaService/asignatura';
import { AsignaturaService } from '../../Services/asignaturaService/asignatura.service';
import { Ciclo } from '../../Services/cicloService/ciclo';
import { CicloService } from '../../Services/cicloService/ciclo.service';
import { Carrera } from '../../Services/carreraService/carrera';
import { CarreraService } from '../../Services/carreraService/carrera.service';
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
  asignaturasSeleccionadas: Asignatura[] = [];
  nombreCiclo : string = '';
  horasTotales: number = 0;
  idCarrera : number = 0;
  idCiclo : number = 0;
  ciclos: any[] = [];
  cicloSeleccionado:  number = 0;
  public asignatura:Asignatura = new Asignatura();
  constructor(private asignaturaService: AsignaturaService,private cicloService: CicloService,private carreraService: CarreraService, private router: Router,
    private activatedRoute: ActivatedRoute){

  }

  ngOnInit(): void{
    this.cargarComboCarreras();
    this.cargarComboCiclos();

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

  calcularHorasTotales():void{
    this.horasTotales = this.asignaturasSeleccionadas.reduce(
      (sum,asignatura) => sum + asignatura.horas_semanales, 0
    );
  }


}
