import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentInjector, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {Usuario} from '../loginService/usuario';
import { appConfig } from '../../environment/appConfig';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
 
  private urlBase =  appConfig.baseUrl;
  private urlEndPoint: string = appConfig.baseUrl;
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' })

  constructor(private http: HttpClient) { }

  getUsuario(): Observable<Usuario[]>{
    return this.http.get<Usuario[]>(`${this.urlBase}/usuario`);
  }  
  
  getUsuariobyId(id: any): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.urlBase}/usuario/${id}`);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlBase}/usuario/${id}`, { headers: this.httpHeaders });
  } 
  
  updateUsuario(usuario: Usuario): Observable<Usuario> {
    const url = `${this.urlEndPoint}/usuario/${usuario.id_usuario}`;
    return this.http.put<Usuario>(url, usuario, { headers: this.httpHeaders })
  }

}