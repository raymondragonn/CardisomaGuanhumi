import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrearEventoService {

  private apiUrl = 'http://localhost:8000/api/v1';

  constructor(private http: HttpClient) { }

  // Método para hacer login
  login(username: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/auth/login`;
    
    // Crear los parámetros en formato x-www-form-urlencoded
    const body = new URLSearchParams();
    body.set('username', username);
    body.set('password', password);

    // Headers para x-www-form-urlencoded
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post(url, body.toString(), { headers });
  }

  // Método para registrar un nuevo usuario
  register(userData: {
    email: string,
    username: string,
    password: string,
    full_name: string,
    permiso: string
  }): Observable<any> {
    const url = `${this.apiUrl}/auth/register`;
    
    // Headers para JSON
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, userData, { headers });
  }

  // Método para obtener todos los eventos
  getEventos(): Observable<any> {
    const url = `${this.apiUrl}/eventos/`;
    
    // Obtener el header de autorización
    const authHeader = this.getAuthorizationHeader();
    
    // Headers con autorización
    const headers = new HttpHeaders({
      'Authorization': authHeader || ''
    });

    return this.http.get(url, { headers });
  }

  // Método para inscribirse a un evento
  inscribirEvento(eventoId: number): Observable<any> {
    const url = `${this.apiUrl}/eventos/${eventoId}/inscribir`;
    
    // Obtener el header de autorización
    const authHeader = this.getAuthorizationHeader();
    
    // Headers con autorización
    const headers = new HttpHeaders({
      'Authorization': authHeader || ''
    });

    return this.http.post(url, {}, { headers });
  }

  // Método para obtener el token del localStorage
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Método para obtener el token type del localStorage
  getTokenType(): string | null {
    return localStorage.getItem('token_type');
  }

  // Método para obtener el header de autorización completo
  getAuthorizationHeader(): string | null {
    const token = this.getToken();
    const tokenType = this.getTokenType();
    
    if (token && tokenType) {
      return `${tokenType} ${token}`;
    }
    
    return null;
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  // Método para cerrar sesión
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('remembered_username');
  }

  // Método para enviar una observación de cangrejo
  enviarObservacion(observacionData: {
    nombre_observador: string | null,
    edad: number | null,
    comunidad: string,
    frecuencia_observacion: string,
    fecha_observacion: string,
    hora_observacion: string,
    lugar_observacion: string,
    tipo_habitat: string,
    tipo_habitat_otro: string | null,
    cantidad_cangrejos: string,
    sexo_cangrejos: string[],
    tamano_cangrejos: string,
    comportamientos: string[],
    comportamiento_otro: string | null,
    mortalidad_atropellamiento: string,
    cambio_poblacion: string,
    amenazas_principales: string[],
    amenaza_otra: string | null,
    importancia_conservacion: number,
    acciones_proteccion: string
  }): Observable<any> {
    const url = `${this.apiUrl}/observaciones/`;
    
    // Obtener el header de autorización
    const authHeader = this.getAuthorizationHeader();
    
    // Headers con autorización y JSON
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': authHeader || ''
    });

    return this.http.post(url, observacionData, { headers });
  }
}
