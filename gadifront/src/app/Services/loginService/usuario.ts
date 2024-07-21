import { Carrera } from "../carreraService/carrera";

export class Usuario {
  id_usuario: number = 0;
  usuario: string = '';
  contrasena: string = '';
  id_persona: number | undefined;
  carrera?: Carrera; 
}
