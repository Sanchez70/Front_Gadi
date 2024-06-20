import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { DistributivoAsignatura } from '../../../Services/distributivoAsignaturaService/distributivo-asignatura';
import { AsignaturaService } from '../../../Services/asignaturaService/asignatura.service';
import { JornadaService } from '../../../Services/jornadaService/jornada.service';
import { AuthService } from '../../../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CicloService } from '../../../Services/cicloService/ciclo.service';
import { CarreraService } from '../../../Services/carreraService/carrera.service';
import { DistributivoAsignaturaService } from '../../../Services/distributivoAsignaturaService/distributivo-asignatura.service';
import { Asignatura } from '../../../Services/asignaturaService/asignatura';
import { Observable } from 'rxjs';
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
  selector: 'app-editar-asignatura',
  templateUrl: './editar-asignatura.component.html',
  styleUrl: './editar-asignatura.component.css'
})
export class EditarAsignaturaComponent {
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
  constructor(private asignaturaService: AsignaturaService,private cicloService: CicloService,private carreraService: CarreraService,
     private jornadaService: JornadaService, private distributivoAsignaturaService: DistributivoAsignaturaService, 
     private authService: AuthService, private router: Router,
    private activatedRoute: ActivatedRoute, private fb: FormBuilder){

  }

  ngOnInit(): void{
    this.authService.explan$.subscribe(explan => {
      this.currentExplan = explan;
    });
    this.cargarComboCarreras();
    this.cargarComboCiclos();
    this.cargarComboJornada();
    this.cargarAsignaturasENviadas();
    this.idCarrera = this.authService.id_carrera;
    
    this.myForm = this.fb.group({
      paraleloSeleccionado: [null, Validators.required],
      cicloSeleccionado: [null, Validators.required]
    })
  }
  cargarAsignaturasENviadas():void{
    this.asignaturasSeleccionadas = this.authService.asignaturasSeleccionadaAuth;
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

  enviarAsignaturasDistributibo():void{
    this.authService.clearLocalStorageAsignatura();
    this.authService.asignaturasSeleccionadaAuth= this.asignaturasSeleccionadas;
    this.router.navigate(['/matriz-distributivo']);
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


  // onCarreraChange(event:any): void{
  //   this.carreraSeleccionada = +event.target.value;
  //   this.idCarrera = this.carreraSeleccionada;
  //   console.log('id carrera',this.idCarrera)
  //   this.filtrarAsignaturaCarrerabyCiclo();
  // }

  onCicloChange(event:any): void{
    this.cicloSeleccionado = +event.target.value;
    this.idCiclo = this.cicloSeleccionado;
    console.log('id ciclo',this.idCiclo)
    this.filtrarAsignaturaCarrerabyCiclo();
    this.myForm.get('cicloSeleccionado')?.setValue(event.target.value);
  }

  onJornadaChange(event:any): void{
    this.jornadaSeleccionada = +event.target.value;
    this.idJornada = this.jornadaSeleccionada;
    console.log('id_jornada',this.idJornada);
  }

  onParaleloChange(event:any): void{
    this.paraleloSeleccionado = event.target.value;
    console.log('paralelo',this.paraleloSeleccionado);
    this.myForm.get('paraleloSeleccionado')?.setValue(event.target.value);
  }

  // createAsignaturaDistributivo(): void {
  //   this.asignaturasSeleccionadas.forEach(asignatura => {
  //     const nuevoAsignaturaDistributivo: DistributivoAsignatura = {
  //       id_jornada: this.idJornada,
  //       paralelo: this.paraleloSeleccionado,
  //       id_distributivo: this.id_distributivo,
  //       id_asignatura: asignatura.id_asignatura
  //     };
  
  //     this.distributivoAsignaturaService.create(nuevoAsignaturaDistributivo).subscribe(response => {
  //       Swal.fire('Asignatura guardada', `guardado con éxito`, 'success')
  //       console.log('Asignatura Distributivo generado');
  //     }, error => {
  //       Swal.fire('ERROR', `no se ha podido guardar correctamente`, 'warning')
  //       console.log('Error al crear', error);
  //     });
  //   });
  // }
  
  filtrarAsignaturaCarrerabyCiclo(): void{
    this.cargarAsignaturas().subscribe(()=>{
      this.asignaturaFiltrada = this.asignaturas.filter(
        (asignatura) => 
          (asignatura.id_carrera === this.idCarrera) && 
          (this.cicloSeleccionado===null || asignatura.id_ciclo === this.idCiclo)
      );
      console.log('asignatura filtrada por ciclo',this.asignaturaFiltrada)
    }); 
  }

  escogerAsignatura(asignatura:Asignatura): void{
    const asignaturaExistente = this.asignaturasSeleccionadas.some(
      (id) => id.id_asignatura === asignatura.id_asignatura
    );
    if(!asignaturaExistente){
      this.asignaturasSeleccionadas.push(asignatura);
      this.calcularHorasTotales();
    }else{
      Toast.fire({
        icon: "warning",
        title: "La asignatura se encuentra seleccionada",
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
