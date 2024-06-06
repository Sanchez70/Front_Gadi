import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Persona } from '../../Services/docenteService/persona';
import { Usuario } from '../../Services/loginService/usuario';
import { Tipo_contrato } from '../../Services/tipo_contrato/tipo_contrato';
import { Grado_ocupacional } from '../../Services/grado/grado_ocupacional';
import { Titulo_profesional } from '../../Services/titulo/titulo_profesional';

@Injectable({
    providedIn: 'root'
  })

export class RegistroService{
    private apiUrlPer = 'http://localhost:8081/api/persona';
    private apiUrlUser = 'http://localhost:8081/api/usuario';
    private apiUrlContr = 'http://localhost:8081/api/tipo_contrato';
    private apiUrlTitulo = 'http://localhost:8081/api/titulo_profesional';
    private apiUrlGrado = 'http://localhost:8081/api/grado_ocupacional';
    private httpHeaders = new HttpHeaders({'Content-Type':'application/json'})

    constructor(private http: HttpClient) { }

    createPer(persona:Persona):Observable<Persona>{
        return this.http.post<Persona>(this.apiUrlPer, persona, {headers: this.httpHeaders})
    }

    createUser(user:Usuario):Observable<Usuario>{
        return this.http.post<Usuario>(this.apiUrlUser, user, {headers: this.httpHeaders})
    }

    createContrato(contrato:Tipo_contrato):Observable<Tipo_contrato>{
        return this.http.post<Tipo_contrato>(this.apiUrlContr, contrato, {headers: this.httpHeaders})
    }

    createTitulo(titulo:Titulo_profesional):Observable<Titulo_profesional>{
        return this.http.post<Titulo_profesional>(this.apiUrlTitulo, titulo, {headers: this.httpHeaders})
    }

    createGrado(grado:Grado_ocupacional):Observable<Grado_ocupacional>{
        return this.http.post<Grado_ocupacional>(this.apiUrlGrado, grado, {headers: this.httpHeaders})
    }

}