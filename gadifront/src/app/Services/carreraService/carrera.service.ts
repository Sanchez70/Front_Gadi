import { Injectable } from '@angular/core';
import { Observable, map, of} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { appConfig } from '../../environment/appConfig';
import { Carrera } from './carrera';

@Injectable({
  providedIn: 'root'
})
export class CarreraService {

  private urlEndPoint: string = appConfig.baseUrl;
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' })
  constructor(private http:HttpClient) { }

  // create(carrera: Carrera): Observable<Carrera> {
  //   return this.http.post<Carrera>(`${this.urlEndPoint}/carrera`, carrera, { headers: this.httpHeaders })
  // }

  // getCarrerabyId(id: any): Observable<Carrera> {
  //   return this.http.get<Carrera>(`${this.urlEndPoint}/carrera/${id}`);
  // }

  getCarrera(): Observable<Carrera[]> {
    return this.http.get<Carrera[]>(`${this.urlEndPoint}/carrera`);
  }

  create(carrera: Carrera): Observable<Carrera> {
    return this.http.post<Carrera>(`${this.urlEndPoint}/carrera`, carrera, { headers: this.httpHeaders });
  }

  getCarreraById(id: number): Observable<Carrera> {
    return this.http.get<Carrera>(`${this.urlEndPoint}/carrera/${id}`);
  }

  update(carrera: Carrera): Observable<Carrera> {
    return this.http.put<Carrera>(`${this.urlEndPoint}/carrera/${carrera.id_carrera}`, carrera, { headers: this.httpHeaders });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlEndPoint}/carrera/${id}`, { headers: this.httpHeaders });
  }  
}
