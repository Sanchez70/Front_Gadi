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

    createUser(persona:Persona):Observable<Persona>{
        return this.http.post<Persona>(this.apiUrlPer, persona, {headers: this.httpHeaders})
    }

    createContrato(persona:Persona):Observable<Persona>{
        return this.http.post<Persona>(this.apiUrlPer, persona, {headers: this.httpHeaders})
    }

    createTitulo(persona:Persona):Observable<Persona>{
        return this.http.post<Persona>(this.apiUrlPer, persona, {headers: this.httpHeaders})
    }

    createGrado(persona:Persona):Observable<Persona>{
        return this.http.post<Persona>(this.apiUrlPer, persona, {headers: this.httpHeaders})
    }

}