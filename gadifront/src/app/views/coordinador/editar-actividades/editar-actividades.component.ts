import { Component } from '@angular/core';
import { ActividadService } from '../../../Services/actividadService/actividad.service';
import { tipo_actividadService } from '../../../Services/tipo_actividadService/tipo_actividad.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Actividad } from '../../../Services/actividadService/actividad';
import Swal from 'sweetalert2';
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
  selector: 'app-editar-actividades',
  templateUrl: './editar-actividades.component.html',
  styleUrl: './editar-actividades.component.css'
})
export class EditarActividadesComponent {
  currentExplan: string='';
  myForm: FormGroup = this.fb.group({});
  public Actividades: Actividad[] = [];
  public Tipos: any[] = [];
  actividadesFiltrada: any[] = [];
  actividadesSeleccionadas: Actividad[] = [];
  tipoActividadSeleccionado: number = 0;
  idTipo: number = 0;
  horasTotales: number = 0;
  constructor(private actividadService: ActividadService, private tipo_actividadService: tipo_actividadService, private router: Router, private activatedRoute: ActivatedRoute, private authService: AuthService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.authService.explan$.subscribe(explan => {
      this.currentExplan = explan;
    });
    
    this.myForm = this.fb.group({
      tipoActividadSeleccionado: [null, Validators.required]
    })
    this.cargarActividadObtenida();
    this.cargartipo();
  }

  cargarActividadObtenida():void{
    this.actividadesSeleccionadas = this.authService.id_actividades;
  }

  cargarACti(): Observable<void> {
    return new Observable(observer => {
      this.actividadService.getActividad().subscribe(data => {
          this.Actividades = data;
          observer.next();
          observer.complete();
      });
  });
  }

  cargartipo(): void {
    this.tipo_actividadService.gettipoActividad().subscribe((Tipos) => {
      this.Tipos = Tipos;
    });
  }

  filtrarActividadabyTipo(): void{
    this.cargarACti().subscribe(()=>{
      this.actividadesFiltrada = this.Actividades.filter(
        (actividad) => 
          (this.tipoActividadSeleccionado===null || actividad.id_tipo_actividad === this.idTipo)
      );
      console.log('actividad filtrada por tipo',this.actividadesFiltrada);
    }); 
  }

  escogerActividad(actividad:Actividad): void{
    const actividadExistente = this.actividadesSeleccionadas.some(
      (id) => id.id_actividad === actividad.id_actividad
    );
    if(!actividadExistente){
      this.actividadesSeleccionadas.push(actividad);
      this.calcularHorasTotales();
    }else{
      Toast.fire({
        icon: "warning",
        title: "La actividad se encuentra seleccionada",
      });
    }
  }

  eliminarActividad(fila:number): void{
    this.actividadesSeleccionadas.splice(fila,1);
    this.calcularHorasTotales()
  }

  calcularHorasTotales():void{
    this.horasTotales = this.actividadesSeleccionadas.reduce(
      (sum,actividad) => sum + actividad.horas_no_docentes, 0
    );
  }

  enviarActividades():void{
    if (this.myForm.valid){
      this.authService.clearLocalStorageActividad();
      this.authService.id_actividades = this.actividadesSeleccionadas;
      console.log('actividades enviadas',this.authService.id_actividades);
      this.authService.saveUserToLocalStorage();
      this.router.navigate(['./matriz-distributivo']);
    }else{
      Toast.fire({
        icon: "warning",
        title: "Por favor, seleccione una opción",
      });
    }
    
  }

  onTipoChange(event:any): void{
    this.tipoActividadSeleccionado = +event.target.value;
    this.idTipo = this.tipoActividadSeleccionado;
    console.log('paralelo',this.tipoActividadSeleccionado);
    this.filtrarActividadabyTipo();
    this.myForm.get('tipoActividadSeleccionado')?.setValue(event.target.value);
  }

  obtenerNombreTipo(id_tipo:number):void{
    const tipo = this.Tipos.find(tipo => tipo.id_tipo_actividad === id_tipo);
    return tipo ? tipo.nom_tip_actividad :'';
  }

}