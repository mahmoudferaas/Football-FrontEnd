import { Injectable } from '@angular/core';
import { HttpService } from '@app/@core/http/http.service';
import { Observable } from 'rxjs';
import { Team } from '../models/shared/team.model';
import { Player } from '../models/shared/player.model';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  private controller = 'players';

  constructor(private http: HttpService) {}

  public getAll(): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.controller}/getall`);
  }
}
