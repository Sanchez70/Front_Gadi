import { HttpClient } from '@angular/common/http';
import { EnvironmentInjector, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {Usuario} from '../loginService/usuario';
import {appConfig} from 'src/app/environment/appConfig';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
 
  private urlBase =  appConfig.baseUrl;

  constructor(private http: HttpClient) { }

  
  buscarUsuario(usuario: string): Observable<Usuario | Usuario[]> {
    const url = `${this.urlBase}/usuario/${usuario}`;
    return this.http.get<Usuario | Usuario[]>(url);
  }
  
}
