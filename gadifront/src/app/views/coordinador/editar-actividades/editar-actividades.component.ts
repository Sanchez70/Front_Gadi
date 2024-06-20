import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { Asignatura } from '../../../Services/asignaturaService/asignatura';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DistributivoAsignatura } from '../../../Services/distributivoAsignaturaService/distributivo-asignatura';
import { AsignaturaService } from '../../../Services/asignaturaService/asignatura.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CicloService } from '../../../Services/cicloService/ciclo.service';
import { CarreraService } from '../../../Services/carreraService/carrera.service';
import { JornadaService } from '../../../Services/jornadaService/jornada.service';
import { DistributivoAsignaturaService } from '../../../Services/distributivoAsignaturaService/distributivo-asignatura.service';
import { AuthService } from '../../../auth.service';
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
  
}
