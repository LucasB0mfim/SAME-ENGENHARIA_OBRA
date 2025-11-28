import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
// import { Geolocation } from '@capacitor/geolocation'; // Removido: Projeto apenas web
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  private readonly _httpClient = inject(HttpClient);

  private _createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado.');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  send(formData: any): Observable<any> {
    const headers = this._createHeaders();
    return this._httpClient.post<any>('https://sameengenharia.com.br/api/equipment-rental/register', formData, { headers });
  }

  create(formData: any) {
    const headers = this._createHeaders();
    return this._httpClient.post<any>('https://sameengenharia.com.br/api/equipament/register', formData, { headers });
  }

  checkin(request: any) {
    const headers = this._createHeaders();
    return this._httpClient.post<any>('https://sameengenharia.com.br/api/equipament/checkin', request, { headers });
  }

  getLocationService(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        reject(new Error('Geolocalização não é suportada neste navegador.'));
        return;
      }

      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000, // 10 segundos
        maximumAge: 0 // Não usar cache
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          });
        },
        (error) => {
          let errorMessage = 'Erro desconhecido ao obter localização.';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Permissão negada para acessar a localização. Verifique as configurações do seu dispositivo e navegador.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Informação de localização indisponível. Verifique sua conexão ou sinal de GPS.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Tempo limite excedido ao tentar obter a localização. Tente novamente.';
              break;
          }
          reject(new Error(errorMessage));
        },
        options
      );
    });
  }
}
