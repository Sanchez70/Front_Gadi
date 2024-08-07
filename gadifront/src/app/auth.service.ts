import { Injectable } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Asignatura } from './Services/asignaturaService/asignatura';
import { Distributivo } from './Services/distributivoService/distributivo';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  asignaturasSeleccionadaAuth: Asignatura[] = [];
  isLogeado = false;
  tiporol: any;
  cedula: any;
  id_persona: any;
  id_asignaturas: any[] = [];
  id_actividades: any[] = [];
  id_jornada: any;
  id_carrera: any;
  paralelo: any;
  id_periodo: any;
  id_distributivo: any;
  distributivos: Distributivo[] = [];
  id_distributivoActividad: any[] = [];
  id_distributivoAsignatura: any;
  iniciales: any;
  explanSubject = new BehaviorSubject<string>('Abrir');
  explan$ = this.explanSubject.asObservable();



  constructor() {
    try {
      if (typeof localStorage !== 'undefined') {
        this.loadUserFromLocalStorage();
      } else {
        console.error('localStorage no está disponible en este entorno.');
      }
    } catch (error) {
      console.error('Ocurrió un error:', error);
      throw new Error('Ocurrió un error inesperado. Por favor, inténtalo de nuevo.');
    }
  }

  loadUserFromLocalStorage() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.isLogeado = user.isLogeado || false;
    this.cedula = user.cedula || null;
    this.tiporol = user.tiporol || null;
    this.id_persona = user.id_persona || null;
    this.id_asignaturas = user.id_asignaturas || null;
    this.id_jornada = user.id_jornada || null;
    this.paralelo = user.paralelo || null;
    this.id_carrera = user.id_carrera || null;
    this.id_actividades = user.id_actividades || null;
    this.asignaturasSeleccionadaAuth = user.asignaturasSeleccionadaAuth || null;
    this.id_periodo = user.id_periodo || null;
    this.id_distributivo = user.id_distributivo || null;
    this.iniciales = user.iniciales || null;

  }

  clearLocalStorage() {
    localStorage.removeItem('user');
    this.asignaturasSeleccionadaAuth = [];

    this.tiporol = '';
    this.cedula = '';
    this.id_persona = '';
    this.id_asignaturas = [];
    this.id_actividades = [];
    this.id_jornada = '';
    this.id_carrera = '';
    this.paralelo = '';
    this.id_periodo = '';
    this.id_distributivo = '';
    this.distributivos = [];
    this.id_distributivoActividad = [];
    this.id_distributivoAsignatura = '';

  }

  clearLocalStorageAsignatura() {
    this.id_asignaturas = [];
    this.asignaturasSeleccionadaAuth = [];
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }
  clearLocalStorageActividad() {
    this.id_actividades = [];
  }

  clearLocalStoragePersona() {
    this.id_persona = '';
  }

  clearLocalStoragePeriodo() {
    this.id_periodo = '';
  }

  clearLocalStorageDistributivos() {
    this.distributivos = [];
  }



  saveUserToLocalStorage() {
    localStorage.setItem('user', JSON.stringify({
      isLogeado: this.isLogeado,
      cedula: this.cedula,
      tiporol: this.tiporol,
      id_persona: this.id_persona,
      id_asignaturas: this.id_asignaturas,
      id_jornada: this.id_jornada,
      paralelo: this.paralelo,
      id_carrera: this.id_carrera,
      id_actividades: this.id_actividades,
      asignaturasSeleccionadaAuth: this.asignaturasSeleccionadaAuth,
      id_periodo: this.id_periodo,
      id_distributivo: this.id_distributivo,
      iniciales: this.iniciales,

    }));
  }
  limpieza() {
    localStorage.clear();
  }
  login() {
    this.isLogeado = true;
    this.saveUserToLocalStorage();
  }

  logout() {
    this.isLogeado = false;
    localStorage.removeItem('token');
    this.saveUserToLocalStorage();
  }

  setCedula(cedula: any) {
    this.cedula = cedula;
    this.saveUserToLocalStorage();
  }

  setIdPersona(id_persona: any) {
    this.id_persona = id_persona;
    this.saveUserToLocalStorage();
  }


  navbar() {
    const currentExplan = this.explanSubject.value;
    const newExplan = currentExplan === 'Abrir' ? 'Cerrar' : 'Abrir';
    this.explanSubject.next(newExplan);
    this.saveUserToLocalStorage();
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  setUser(user: any) {
    this.isLogeado = user.isLogeado;
    this.cedula = user.cedula;
    this.tiporol = user.tiporol;
    this.id_persona = user.id_persona;
    this.id_asignaturas = user.id_asignaturas;
    this.id_jornada = user.id_jornada;
    this.paralelo = user.paralelo;
    this.id_carrera = user.id_carrera;
    this.id_actividades = user.id_actividades;
    this.asignaturasSeleccionadaAuth = user.asignaturasSeleccionadaAuth;
    this.id_periodo = user.id_periodo;
    this.id_distributivo = user.id_distributivo;
    this.saveUserToLocalStorage();
  }
}