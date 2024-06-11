import { Injectable } from '@angular/core';
import { appConfig } from '../../environment/appConfig';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UsuarioRol } from './usuarioRol';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioRolService {
  private urlEndPoint: string = appConfig.baseUrl;
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' })
  constructor(private http:HttpClient) { }

  getRol():Observable<UsuarioRol[]>{
    return this.http.get<UsuarioRol[]>(`${this.urlEndPoint}/usuarioRol`)
  }

  create(usuarioRol: UsuarioRol): Observable<UsuarioRol> {
    return this.http.post<UsuarioRol>(`${this.urlEndPoint}/usuarioRol`, usuarioRol, { headers: this.httpHeaders })
  }

  getRolbyId(id: any): Observable<UsuarioRol> {
    return this.http.get<UsuarioRol>(`${this.urlEndPoint}/usuarioRol/${id}`);
  }

  deleteid(id: any): Observable<UsuarioRol> {
    return this.http.delete<UsuarioRol>(`${this.urlEndPoint}/usuarioRol/${id}`);
  }
}
