import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../enviroment';
import { Observable } from 'rxjs';

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  register(userData: RegisterData): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }
}