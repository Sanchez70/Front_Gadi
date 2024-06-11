import { Injectable } from '@angular/core';
import { appConfig } from '../../environment/appConfig';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rol } from './rol';

@Injectable({
  providedIn: 'root'
})
export class SrolService {

  private urlEndPoint: string = appConfig.baseUrl;
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' })
  constructor(private http:HttpClient) { }

  getRol():Observable<Rol[]>{
    return this.http.get<Rol[]>(`${this.urlEndPoint}/rol`)
  }

  create(rol: Rol): Observable<Rol> {
    return this.http.post<Rol>(`${this.urlEndPoint}/rol`, rol, { headers: this.httpHeaders })
  }

  getRolbyId(id: any): Observable<Rol> {
    return this.http.get<Rol>(`${this.urlEndPoint}/rol/${id}`);
  }

  deleteid(id: any): Observable<Rol> {
    return this.http.delete<Rol>(`${this.urlEndPoint}/rol/${id}`);
  }
}
