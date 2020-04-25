import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-team',
  templateUrl: './update-team.component.html',
  styleUrls: ['./update-team.component.scss'],
})
export class UpdateTeamComponent implements OnInit {
  isLoading = false;
  teamId: number;
  addTeamForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private httpClient: HttpClient, private route: ActivatedRoute) {
    this.buildForm();
    this.route.params.subscribe((params) => {
      this.teamId = +params['id'];
    });
  }

  ngOnInit() {
    this.httpClient.get(`teams/getbyid/${this.teamId}`).subscribe((data) => {
      console.log(data);
      this.buildForm(data);
    });
  }

  buildForm(data?: any) {
    this.addTeamForm = this.formBuilder.group({
      id: [data ? data.id : ''],
      name: [data ? data.name : '', Validators.required],
      country: [data ? data.country : '', Validators.required],
      foundationDate: [data ? data.foundationDate : '', Validators.required],
      coachName: [data ? data.coachName : '', Validators.required],
      logoImage: [data ? data.logoImage : '', Validators.required],
      players: this.formBuilder.array([]),
    });

    if (data?.players?.length > 0) {
      data.players.map((player: any) => this.addTeamPlayer(player));
    }
  }

  get players() {
    return this.addTeamForm.get('players') as FormArray;
  }

  get teamLogo() {
    return this.addTeamForm.get('logoImage').value;
  }

  get teamName() {
    return this.addTeamForm.get('name').value;
  }

  initTeamPlayer(data?: any) {
    return this.formBuilder.group({
      id: [data ? data.id : null],
      name: [data ? data.name : '', Validators.required],
      nationality: [data ? data.nationality : '', Validators.required],
      dateOfBirth: [data ? data.dateOfBirth : '', Validators.required],
      image: [data ? data.image : '', Validators.required],
    });
  }

  addTeamPlayer(data?: any) {
    this.players.push(this.initTeamPlayer(data));
  }

  removeNulls(obj: any) {
    var isArray = obj instanceof Array;
    for (var k in obj) {
      if (obj[k] === null) isArray ? obj.splice(k, 1) : delete obj[k];
      else if (typeof obj[k] == 'object') this.removeNulls(obj[k]);
      if (isArray && obj.length == k) this.removeNulls(obj);
    }
    return obj;
  }

  onSubmit() {
    if (this.addTeamForm.valid) {
      const data = this.removeNulls(this.addTeamForm.value);
      this.httpClient.put(`teams/update/${this.teamId}`, data).subscribe((data) => {
        console.log(data);
      });
    }
  }

  onFileComplete(data: any, input: string) {
    this.addTeamForm.get(input).setValue(data.link);
  }

  onPlayerFileComplete(data: any, index: number) {
    this.players.at(index).get('image').setValue(data.link);
  }

  getPlayerImage(index: number) {
    return this.players.at(index).get('image').value;
  }
}
