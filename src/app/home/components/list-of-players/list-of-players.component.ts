import { Component, OnInit } from '@angular/core';
import { Player } from '@app/home/models/shared/player.model';
import { PlayersService } from '@app/home/services/players.service';

@Component({
  selector: 'app-list-of-players',
  templateUrl: './list-of-players.component.html',
  styleUrls: ['./list-of-players.component.scss'],
})
export class ListOfPlayersComponent implements OnInit {
  players: Player[];

  displayedColumns: string[] = ['id', 'name', 'nationality', 'dateOfBirth'];

  constructor(private playersService: PlayersService) {}

  ngOnInit(): void {
    this.loadPlayers();
  }

  loadPlayers() {
    this.playersService.getAll().subscribe((response: Player[]) => {
      if (response && response.length > 0) {
        this.players = response;
      }
    });
  }
}
