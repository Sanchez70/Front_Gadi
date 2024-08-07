import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Periodo } from '../periodo/periodo';
import { GradoOcupacional } from '../grado-ocupacional/grado-ocupacional';
import { TipoContrato } from '../tipo-contrato/tipo-contrato';
import { TituloProfecional } from '../titulo-profesional/titulo-profecional';
import { Usuario } from '../../Services/loginService/usuario';
import { Carrera } from '../../Services/carreraService/carrera';
import { Rol } from '../rol/rol';
import { appConfig } from '../../environment/appConfig';

@Injectable({
  providedIn: 'root'
})
export class RolService {

    private urlEndPoint: string = appConfig.baseUrl;

  constructor(private http: HttpClient) { }

getRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${this.urlEndPoint}/rol`);
  }
}