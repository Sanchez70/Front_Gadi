import { Carrera } from "../carreraService/carrera";

export class Usuario {
  id_usuario: string = '';
  usuario: string = '';
  contrasena: string = '';
  carrera: Carrera |undefined;
}