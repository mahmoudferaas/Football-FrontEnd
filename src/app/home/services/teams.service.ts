import { Injectable } from '@angular/core';
import { HttpService } from '@app/@core/http/http.service';
import { Observable } from 'rxjs';
import { Team } from '../models/shared/team.model';

@Injectable({
  providedIn: 'root',
})
export class TeamsService {
  private controller = 'teams';

  constructor(private http: HttpService) {}

  public getAll(): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.controller}/getall`);
  }
}
