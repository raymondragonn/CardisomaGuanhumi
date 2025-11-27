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

  // Método para obtener todos los eventos (público, no requiere autenticación)
  getEventos(): Observable<any> {
    const url = `${this.apiUrl}/eventos/`;
    
    // No se requiere autenticación para ver eventos
    // Si hay token, se envía opcionalmente, pero no es requerido
    const authHeader = this.getAuthorizationHeader();
    
    let headers = new HttpHeaders();
    if (authHeader) {
      headers = headers.set('Authorization', authHeader);
    }

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

  // Método para obtener el nombre de usuario actual
  getCurrentUsername(): string | null {
    return localStorage.getItem('current_username');
  }

  // Método para obtener el permiso del usuario actual
  getCurrentUserPermiso(): string | null {
    return localStorage.getItem('user_permiso');
  }

  // Método para obtener información del usuario actual desde el backend
  getCurrentUserInfo(): Observable<any> {
    const url = `${this.apiUrl}/auth/me`;
    
    // Obtener el header de autorización
    const authHeader = this.getAuthorizationHeader();
    
    // Headers con autorización
    const headers = new HttpHeaders({
      'Authorization': authHeader || ''
    });

    return this.http.get(url, { headers });
  }

  // Método para verificar si el usuario es administrador
  isAdmin(): boolean {
    return this.getCurrentUserPermiso() === 'admin';
  }

  // Método para cerrar sesión
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('remembered_username');
    localStorage.removeItem('current_username');
    localStorage.removeItem('user_permiso');
  }

  // Método para crear un nuevo evento (solo admin)
  crearEvento(eventoData: {
    titulo: string,
    descripcion: string,
    fecha: string,
    hora: string,
    lugar: string,
    duracion: number,
    requisitos: string | null,
    tipo: string
  }): Observable<any> {
    const url = `${this.apiUrl}/eventos/`;
    
    // Obtener el header de autorización
    const authHeader = this.getAuthorizationHeader();
    
    // Headers con autorización y JSON
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': authHeader || ''
    });

    return this.http.post(url, eventoData, { headers });
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

  // Método para obtener todas las observaciones
  getObservaciones(): Observable<any> {
    const url = `${this.apiUrl}/observaciones/`;
    
    // Obtener el header de autorización
    const authHeader = this.getAuthorizationHeader();
    
    // Headers con autorización
    const headers = new HttpHeaders({
      'Authorization': authHeader || ''
    });

    return this.http.get(url, { headers });
  }

  // Método para obtener una observación específica por ID
  getObservacionById(id: number): Observable<any> {
    const url = `${this.apiUrl}/observaciones/${id}/`;
    
    // Obtener el header de autorización
    const authHeader = this.getAuthorizationHeader();
    
    // Headers con autorización
    const headers = new HttpHeaders({
      'Authorization': authHeader || ''
    });

    return this.http.get(url, { headers });
  }

  // Método para obtener observaciones de Naturalista (SNIB)
  getObservacionesNaturalista(params?: {
    limit?: number,
    offset?: number,
    estado?: string,
    municipio?: string,
    fecha_inicio?: string,
    fecha_fin?: string
  }): Observable<any> {
    let url = `${this.apiUrl}/observaciones-naturalista/`;
    
    // Construir query params
    const queryParams: string[] = [];
    if (params) {
      if (params.limit) queryParams.push(`limit=${params.limit}`);
      if (params.offset) queryParams.push(`offset=${params.offset}`);
      if (params.estado) queryParams.push(`estado=${encodeURIComponent(params.estado)}`);
      if (params.municipio) queryParams.push(`municipio=${encodeURIComponent(params.municipio)}`);
      if (params.fecha_inicio) queryParams.push(`fecha_inicio=${params.fecha_inicio}`);
      if (params.fecha_fin) queryParams.push(`fecha_fin=${params.fecha_fin}`);
    }
    
    if (queryParams.length > 0) {
      url += '?' + queryParams.join('&');
    }

    return this.http.get(url);
  }

  // Método para obtener estadísticas de observaciones Naturalista
  getEstadisticasNaturalista(): Observable<any> {
    const url = `${this.apiUrl}/observaciones-naturalista/estadisticas`;
    return this.http.get(url);
  }

  // Método para subir foto/video a una observación existente
  subirFotoObservacion(observacionId: number, archivo: File): Observable<any> {
    const url = `${this.apiUrl}/observaciones/${observacionId}/foto`;
    
    // Crear FormData para enviar archivo
    const formData = new FormData();
    formData.append('foto', archivo);
    
    // Obtener el header de autorización
    const authHeader = this.getAuthorizationHeader();
    
    // Headers con autorización (sin Content-Type, se establece automáticamente para FormData)
    const headers = new HttpHeaders({
      'Authorization': authHeader || ''
    });

    return this.http.post(url, formData, { headers });
  }
}
