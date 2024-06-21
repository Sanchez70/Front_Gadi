import { Carrera } from "../carreraService/carrera";

export class Usuario {
  id_usuario?: number ;
  usuario: string = '';
  contrasena: string = '';
  id_persona: number = 0;
  carrera: Carrera | undefined;
}