import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Persona } from '../../Services/docenteService/persona';
import { Usuario } from '../../Services/loginService/usuario';
import { Tipo_contrato } from '../../Services/tipo_contrato/tipo_contrato';
import { Titulo_profesional } from '../../Services/titulo/titulo_profesional';
import { UsuarioRol } from '../UsuarioRol/usuarioRol';
import { appConfig } from '../../environment/appConfig';

@Injectable({
    providedIn: 'root'
  })

export class RegistroService{
    private urlBase =  appConfig.baseUrl;
    private httpHeaders = new HttpHeaders({'Content-Type':'application/json'})

    constructor(private http: HttpClient) { }

    createPer(persona: Persona): Observable<Persona> {
        return this.http.post<Persona>(`${this.urlBase}/persona`, persona, { headers: this.httpHeaders})
      }

    createUser(user:Usuario):Observable<Usuario>{
        return this.http.post<Usuario>(`${this.urlBase}/usuario`, user, {headers: this.httpHeaders})
    }

    createContrato(contrato:Tipo_contrato):Observable<Tipo_contrato>{
        return this.http.post<Tipo_contrato>(`${this.urlBase}/tipo_contrato`, contrato, {headers: this.httpHeaders})
    }

    createTitulo(titulo:Titulo_profesional):Observable<Titulo_profesional>{
        return this.http.post<Titulo_profesional>(`${this.urlBase}/titulo_profesional`, titulo, {headers: this.httpHeaders})
    }

    create(usuarioRol: UsuarioRol): Observable<UsuarioRol> {
        return this.http.post<UsuarioRol>(`${this.urlBase}/usuarioRol`, usuarioRol, { headers: this.httpHeaders })
      }
}