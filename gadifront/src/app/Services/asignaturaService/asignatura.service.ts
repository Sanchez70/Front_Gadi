import { Injectable } from '@angular/core';
import { appConfig } from '../../environment/appConfig';
import { Asignatura } from './asignatura';
import { Observable} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AsignaturaService {

  private urlEndPoint: string = appConfig.baseUrl;
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' })
  constructor(private http:HttpClient) { }

  getAsignatura():Observable<Asignatura[]>{
    return this.http.get<Asignatura[]>(`${this.urlEndPoint}/asignatura`)
  }

  create(asignatura: Asignatura): Observable<Asignatura> {
    return this.http.post<Asignatura>(`${this.urlEndPoint}/asignatura`, asignatura, { headers: this.httpHeaders })
  }

  getAsignaturabyId(id: any): Observable<Asignatura> {
    return this.http.get<Asignatura>(`${this.urlEndPoint}/asignatura/${id}`);
  }

  update(asignatura: Asignatura): Observable<Asignatura> {
    return this.http.put<Asignatura>(`${this.urlEndPoint}/asignatura/${asignatura.id_asignatura}`, asignatura, { headers: this.httpHeaders });
  }
  
  
}
