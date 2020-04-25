import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.scss'],
})
export class AddTeamComponent implements OnInit {
  isLoading = false;
  addTeamForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private httpClient: HttpClient) {
    this.buildForm();
  }

  ngOnInit() {
    this.isLoading = true;
  }

  buildForm() {
    this.addTeamForm = this.formBuilder.group({
      id: [null],
      name: ['', Validators.required],
      country: ['', Validators.required],
      foundationDate: ['', Validators.required],
      coachName: ['', Validators.required],
      logoImage: ['', Validators.required],
      players: this.formBuilder.array([]),
    });
  }

  get players() {
    return this.addTeamForm.get('players') as FormArray;
  }

  initTeamPlayer() {
    return this.formBuilder.group({
      id: [null],
      name: ['', Validators.required],
      nationality: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      image: ['', Validators.required],
    });
  }

  addTeamPlayer() {
    this.players.push(this.initTeamPlayer());
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
      this.httpClient.post('teams/getbyid/1', data).subscribe((data) => {
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
}
