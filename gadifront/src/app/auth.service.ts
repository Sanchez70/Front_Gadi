import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLogeado = false;
  rol: any;
  cedula: any;
  id_persona: any;
  id_asignaturas: any[] = [];
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
      // Manejo de la excepción
      console.error('Ocurrió un error:', error);
      // Puedes realizar otras acciones de manejo de errores aquí
      // Por ejemplo, puedes lanzar una nueva excepción personalizada
      throw new Error('Ocurrió un error inesperado. Por favor, inténtalo de nuevo.');
    }


  }
  loadUserFromLocalStorage() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.isLogeado = user.isLogeado || false;
    this.cedula = user.cedula || null;
    this.rol = user.rol || null
    this.id_persona = user.id_persona || null;
    this.id_asignaturas = user.id_asignaturas || null;
  }
  clearLocalStorage() {
    localStorage.removeItem('user');
    this.id_persona='';
  }

  clearLocalStorageAsignatura() {
    this.id_asignaturas=[];
  }

  saveUserToLocalStorage() {
    // Guarda la información del usuario en localStorage
    localStorage.setItem('user', JSON.stringify({
      isLogeado: this.isLogeado,
      cedula: this.cedula,
      rol: this.rol,
      id_persona:this.id_persona,
      id_asignaturas:this.id_asignaturas
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
