import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Asignatura } from '../../Services/asignaturaService/asignatura';
import { AsignaturaService } from '../../Services/asignaturaService/asignatura.service';
import { Ciclo } from '../../Services/cicloService/ciclo';
import { CicloService } from '../../Services/cicloService/ciclo.service';
import { Carrera } from '../../Services/carreraService/carrera';
import { CarreraService } from '../../Services/carreraService/carrera.service';

@Component({
  selector: 'app-asignatura',
  templateUrl: './asignatura.component.html',
  styleUrl: './asignatura.component.css'
})
export class AsignaturaComponent implements OnInit {
  carreras: any[] = [];
  carreraSeleccionada: number = 0;
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

  onCarreraChange(event:any): void{
    this.carreraSeleccionada = +event.target.value;
    this.idCarrera = this.carreraSeleccionada;
    console.log('id carrera',this.idCarrera)
  }

  onCicloChange(event:any): void{
    this.cicloSeleccionado = +event.target.value;
    this.idCiclo = this.cicloSeleccionado;
    console.log('id ciclo',this.idCiclo)
  }

}
