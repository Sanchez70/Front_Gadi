
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Actividad } from '../../Services/actividadService/actividad';
import { tipo_actividad } from '../../Services/tipo_actividadService/tipo_actividad';
import { ActividadService } from '../../Services/actividadService/actividad.service';
import { tipo_actividadService } from '../../Services/tipo_actividadService/tipo_actividad.service';
import { DistributivoActividad } from '../../Services/distributivoActividadService/distributivo_actividad';
import Swal from 'sweetalert2';
import { response } from 'express';
import { DistributivoActividadService } from '../../Services/distributivoActividadService/distributivo_actividad.service';
import { AuthService } from '../../auth.service';
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
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {
  public actividad: Actividad = new Actividad()
  public Actividades: Actividad[] = [];
  actividadesFiltrada: any[] = [];
  actividadesSeleccionadas: Actividad[] = [];
  public tipo: tipo_actividad = new tipo_actividad()
  public Tipos: any[] = [];
  tipoActividadSeleccionado: number = 0;
  public distributivo: DistributivoActividad = new DistributivoActividad()
  public Distributivos: DistributivoActividad[] = [];
  public titulo: String = "CREAR ACTIVIDAD"
  currentExplan: string='';
  idTipo: number = 0;
  horasTotales: number = 0;
  myForm: FormGroup = this.fb.group({});
  constructor(private distributivoService: DistributivoActividadService, private actividadService: ActividadService, private tipo_actividadService: tipo_actividadService, private router: Router, private activatedRoute: ActivatedRoute, private authService: AuthService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.authService.explan$.subscribe(explan => {
      this.currentExplan = explan;
    });
    this.cargartipo();
    this.myForm = this.fb.group({
      tipoActividadSeleccionado: [null, Validators.required]
    })
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
      this.authService.saveUserToLocalStorage();
      this.router.navigate(['./distributivo']);
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