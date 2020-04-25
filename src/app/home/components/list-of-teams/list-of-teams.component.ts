import { Component, OnInit } from '@angular/core';
import { TeamsService } from '@app/home/services/teams.service';
import { Team } from '@app/home/models/shared/team.model';
import { AuthenticationService } from '@app/auth/authentication.service';

@Component({
  selector: 'app-list-of-teams',
  templateUrl: './list-of-teams.component.html',
  styleUrls: ['./list-of-teams.component.scss'],
})
export class ListOfTeamsComponent implements OnInit {
  teams: Team[];

  displayedColumns: string[];

  constructor(private teamService: TeamsService, private authService: AuthenticationService) {}

  ngOnInit(): void {
    this.initDataTables();
    this.loadTeams();
  }

  initDataTables() {
    if (this.authService.isAdministratorUser()) {
      this.displayedColumns = ['id', 'name', 'country', 'coachName', 'foundationDate', 'actions'];
    } else {
      this.displayedColumns = ['id', 'name', 'country', 'coachName', 'foundationDate'];
    }
  }

  loadTeams() {
    this.teamService.getAll().subscribe((response: Team[]) => {
      if (response && response.length > 0) {
        this.teams = response;
      }
    });
  }
}
