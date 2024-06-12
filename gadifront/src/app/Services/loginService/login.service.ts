import { HttpClient } from '@angular/common/http';
import { EnvironmentInjector, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {Usuario} from '../loginService/usuario';
import { appConfig } from '../../environment/appConfig';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
 
  private urlBase =  appConfig.baseUrl;

  constructor(private http: HttpClient) { }

  getUsuario(): Observable<Usuario[]>{

    return this.http.get<Usuario[]>(`${this.urlBase}/usuario`);
  }  
}