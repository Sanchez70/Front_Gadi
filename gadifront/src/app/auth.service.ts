import { Injectable } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLogeado = true;
  tiporol: any;
  cedula: any;
  id_persona: any;
  id_asignaturas: any[] = [];
  id_jornada: any;
  id_carrera:any;
  paralelo: any;
  private explanSubject = new BehaviorSubject<string>('Abrir');
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
  }

  clearLocalStorage() {
    localStorage.removeItem('user');
    this.id_persona = '';
  }

  clearLocalStorageAsignatura() {
    this.id_asignaturas = [];
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
      id_carrera: this.id_carrera
    }));
  }

  login() {
    this.isLogeado = true;
    this.saveUserToLocalStorage();
  }

  logout() {
    this.isLogeado = false;
    this.saveUserToLocalStorage();
  }

  setCedula(cedula: any) {
    this.cedula = cedula;
    this.saveUserToLocalStorage();
  }

  navbar() {
    const currentExplan = this.explanSubject.value;
    const newExplan = currentExplan === 'Abrir' ? 'Cerrar' : 'Abrir';
    this.explanSubject.next(newExplan);
    this.saveUserToLocalStorage();
  }
}