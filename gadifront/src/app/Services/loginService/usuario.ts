import { Carrera } from "../carreraService/carrera";

export class Usuario {
  id_usuario?: number ;
  usuario: string = '';
  contrasena: string = '';
  carrera: Carrera | undefined;
}