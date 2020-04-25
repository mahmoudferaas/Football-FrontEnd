import { Injectable } from '@angular/core';
import { HttpService } from '@app/@core/http/http.service';
import { LoginRequest } from '../models/login-request.model';
import { LoginResponse } from '../models/login-response.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private controller = 'users';

  constructor(private http: HttpService) {}

  public login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.controller}/login`, request);
  }
}
