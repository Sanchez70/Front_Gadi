import { Carrera } from "../../Services/carreraService/carrera";

export interface Usuario{
    id_usuario: number;
	usuario: String;
	contrasena: String;
	id_persona: number;
    id_carrera: Carrera;
}