
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
  
  constructor(private distributivoService: DistributivoActividadService, private actividadService: ActividadService, private tipo_actividadService: tipo_actividadService, private router: Router, private activatedRoute: ActivatedRoute, private authService: AuthService, private fb: FormBuilder) { }

  ngOnInit(): void {
  }


}