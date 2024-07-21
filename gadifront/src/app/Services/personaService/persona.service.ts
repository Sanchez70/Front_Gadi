import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { Persona } from './persona';
import { Periodo } from '../../views/periodo/periodo';
import { GradoOcupacional } from '../../views/grado-ocupacional/grado-ocupacional';
import { TipoContrato } from '../../views/tipo-contrato/tipo-contrato';
import { TituloProfecional } from '../../views/titulo-profesional/titulo-profecional';
import { Carrera } from '../carreraService/carrera';
import { Rol } from '../../views/rol/rol';
import { UsuarioRol } from '../../views/usuario-rol/UsuarioRol';
import { Usuario } from '../loginService/usuario';
import { appConfig } from '../../environment/appConfig';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  private urlEndPoint: string = appConfig.baseUrl;

  constructor(private http: HttpClient) { }

  getPersonas(): Observable<Persona[]> {
    return this.http.get<Persona[]>(`${this.urlEndPoint}/persona`);
  }

  getPeriodos(): Observable<Periodo[]> {
    return this.http.get<Periodo[]>(`${this.urlEndPoint}/periodo`);
  }

  getGadosOcupacionales(): Observable<GradoOcupacional[]> {
    return this.http.get<GradoOcupacional[]>(`${this.urlEndPoint}/grado_ocupacional`);
  }

  getTiposContratos(): Observable<TipoContrato[]> {
    return this.http.get<TipoContrato[]>(`${this.urlEndPoint}/tipo_contrato`);
  }

  getTitulosProfecionales(): Observable<TituloProfecional[]> {
    return this.http.get<TituloProfecional[]>(`${this.urlEndPoint}/titulo_profesional`);
  }
  
  getPersonaById(id: number): Observable<Persona> {
    return this.http.get<Persona>(`${this.urlEndPoint}/persona/${id}`).pipe(
        map(persona => {
            persona.fecha_vinculacion = new Date(persona.fecha_vinculacion);
            return persona;
        })
    );
}

  getPersonaByCedula(cedula: string): Observable<Persona> {
    return this.http.get<Persona>(`${this.urlEndPoint}/persona/cedula/${cedula}`);
  }

  getUsuarioByPersonaId(id_persona: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.urlEndPoint}/usuario/persona/${id_persona}`);
  }

  getTituloByPersonaId(id_persona: number): Observable<TituloProfecional> {
    return this.http.get<TituloProfecional>(`${this.urlEndPoint}/titulo_profesional/persona/${id_persona}`);
  }

  getCarreras(): Observable<Carrera[]> {
    return this.http.get<Carrera[]>(`${this.urlEndPoint}/carrera`);
  }

  getPeriodoById(id: number): Observable<Periodo> {
    return this.http.get<Periodo>(`${this.urlEndPoint}/periodo/${id}`);
  }

  getGradoById(id: number): Observable<GradoOcupacional> {
    return this.http.get<GradoOcupacional>(`${this.urlEndPoint}/grado_ocupacional/${id}`);
  }

  getContratoById(id: number): Observable<TipoContrato> {
    return this.http.get<TipoContrato>(`${this.urlEndPoint}/tipo_contrato/${id}`);
  }

  getTituloById(id: number): Observable<TituloProfecional> {
    return this.http.get<TituloProfecional>(`${this.urlEndPoint}/titulo_profesional/${id}`);
  }

  getTitulosProfecionalesByPersonaId(personaId: number): Observable<TituloProfecional[]> {
    return this.http.get<TituloProfecional[]>(`${this.urlEndPoint}/titulo_profesional/persona/${personaId}`);
  }

  createUsuarioRol(usuarioRol: UsuarioRol): Observable<UsuarioRol> {
    return this.http.post<UsuarioRol>(`${this.urlEndPoint}/usuarioRol`, usuarioRol);
  }

  saveUsuarioRol(usuarioRol: UsuarioRol): Observable<UsuarioRol> {
    return this.http.post<UsuarioRol>(`${this.urlEndPoint}/usuarioRol`, usuarioRol);
  }

  updateUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.urlEndPoint}/usuario/${usuario.id_usuario}`, usuario);
  }

  updatePersona(persona: Persona): Observable<Persona> {
    return this.http.put<Persona>(`${this.urlEndPoint}/persona/${persona.id_persona}`, persona);
  }

  getPersonasConUsuarios(): Observable<any[]> {
    return this.http.get<Persona[]>(`${this.urlEndPoint}/persona`).pipe(
      switchMap(persona => {
        const observables = persona.map(persona =>
          this.http.get<Usuario>(`${this.urlEndPoint}/usuario/persona/${persona.id_persona}`).pipe(
            map(usuario => ({
              ...persona,
              usuario: usuario.usuario,
            }))
          )
        );
        return forkJoin(observables);
      })
    );
  }
}
