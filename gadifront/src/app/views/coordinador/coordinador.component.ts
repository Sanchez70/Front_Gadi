import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonaService } from '../persona/persona.service';
import { TituloProfesionalService } from '../../Services/titulo/titulo-profesional.service';
import { GradoOcupacionalService } from '../../Services/grado/grado-ocupacional.service';
import { TipoContratoService } from '../../Services/tipo_contrato/tipo-contrato.service';
import { Persona } from '../../Services/docenteService/persona';
import { Grado_ocupacional } from '../../Services/grado/grado_ocupacional';
import { Tipo_contrato } from '../../Services/tipo_contrato/tipo_contrato';
import { Titulo_profesional } from '../../Services/titulo/titulo_profesional';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AuthService } from '../../auth.service';
interface PersonaExtendida extends Persona {
  nombre_contrato?: string;
  nombre_titulo?: string;
  nombre_grado_ocp?: string;
}
@Component({
  selector: 'app-coordinador',
  templateUrl: './coordinador.component.html',
  styleUrl: './coordinador.component.css'
})
export class CoordinadorComponent implements OnInit {
  displayedColumns: string[] = ['cedula', 'nombre', 'apellido','fecha_vinculacion','detalles'];
  dataSource = new MatTableDataSource<Persona>();

  personas : Persona[] = [];
  personaEncontrada : Persona = new Persona();
  gradoOcupacional : Grado_ocupacional = new Grado_ocupacional();
  tipo_contrato: Tipo_contrato = new Tipo_contrato();
  titulo: Titulo_profesional = new Titulo_profesional();
  cedula: string = '';
  color = '#1E90FF';
  currentExplan: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private personaService: PersonaService,
    private tipo_contratoService: TipoContratoService, 
    private tituloService: TituloProfesionalService, 
    private gradoService: GradoOcupacionalService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute){
  }
  ngOnInit(): void{
    this.authService.explan$.subscribe(explan => {
      this.currentExplan = explan;
    });

    this.personaService.getPersonas().subscribe(data =>{
      this.personas = data;
      this.dataSource.data = this.personas;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log(this.dataSource);
    })
  }

  buscarPersona(): void{
    this.personaService.getPersonaByCedula(this.cedula).subscribe(data =>{
      this.personaEncontrada = data;
      console.log('id_persona',this.personaEncontrada.id_persona);
      this.loadPersonaData(this.personaEncontrada.id_persona);
    });
    
  }

  loadPersonaData(personaId: number): void {
    this.personaService.getPersonaById(personaId).subscribe(data => {
      this.personaEncontrada = data;
      this.dataSource.data = [this.personaEncontrada];
    });
  }

 

  onChangeBuscar(event: any): void{
    this.cedula = event.target.value;
    console.log('cedula ingresada',this.cedula)
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
    }
}
}

