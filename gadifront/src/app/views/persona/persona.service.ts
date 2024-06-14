import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Persona } from './persona';
import { Periodo } from '../periodo/periodo';
import { GradoOcupacional } from '../grado-ocupacional/grado-ocupacional';
import { TipoContrato } from '../tipo-contrato/tipo-contrato';
import { TituloProfecional } from '../titulo-profesional/titulo-profecional';
// import { Usuario } from '../usuario/usuario';
import { Carrera } from '../../Services/carreraService/carrera';
import { Rol } from '../rol/rol';
import { UsuarioRol } from '../usuario-rol/UsuarioRol';
import { Usuario } from '../../Services/loginService/usuario';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  private baseUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient) { }

  getPersonas(): Observable<Persona[]> {
    return this.http.get<Persona[]>(`${this.baseUrl}/persona`);
  }

  getPeriodos(): Observable<Periodo[]> {
    return this.http.get<Periodo[]>(`${this.baseUrl}/periodo`);
  }

  getGadosOcupacionales(): Observable<GradoOcupacional[]> {
    return this.http.get<GradoOcupacional[]>(`${this.baseUrl}/grado_ocupacional`);
  }

  
  getTiposContratos(): Observable<TipoContrato[]> {
    return this.http.get<TipoContrato[]>(`${this.baseUrl}/tipo_contrato`);
  }
  getTitulosProfecionales(): Observable<TituloProfecional[]> {
    return this.http.get<TituloProfecional[]>(`${this.baseUrl}/titulo_profesional`);
  }
  getPersonaById(id: number): Observable<Persona> {
    return this.http.get<Persona>(`${this.baseUrl}/persona/${id}`);
  }
  getPersonaByCedula(cedula: string): Observable<Persona> {
    return this.http.get<Persona>(`${this.baseUrl}/persona/cedula/${cedula}`);
  }

  getUsuarioByPersonaId(id_persona: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/usuario/persona/${id_persona}`);
  }

  getCarreras(): Observable<Carrera[]> {
    return this.http.get<Carrera[]>(`${this.baseUrl}/carrera`);
  }
  
  getPeriodoById(id: number): Observable<Periodo> {
    return this.http.get<Periodo>(`${this.baseUrl}/periodo/${id}`);
  }

  getGradoById(id: number): Observable<GradoOcupacional> {
    return this.http.get<GradoOcupacional>(`${this.baseUrl}/grado_ocupacional/${id}`);
  }

  getContratoById(id: number): Observable<TipoContrato> {
    return this.http.get<TipoContrato>(`${this.baseUrl}/tipo_contrato/${id}`);
  }
  getTituloById(id: number): Observable<TituloProfecional> {
    return this.http.get<TituloProfecional>(`${this.baseUrl}/titulo_profesional/${id}`);
  }

  createUsuarioRol(usuarioRol: UsuarioRol): Observable<UsuarioRol> {
    return this.http.post<UsuarioRol>(`${this.baseUrl}/usuarioRol`, usuarioRol);
  }

  saveUsuarioRol(usuarioRol: UsuarioRol): Observable<UsuarioRol> {
    return this.http.post<UsuarioRol>(`${this.baseUrl}/usuarioRol`, usuarioRol);
  }

  updateUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.baseUrl}/usuario/${usuario.id_usuario}`, usuario);
  }


  // updateUsuario(usuario: Usuario): Observable<Usuario> {
  //   return this.http.put<Usuario>(`${this.baseUrl}/usuario/${usuario.id_usuario}`, usuario);
  // }
}
