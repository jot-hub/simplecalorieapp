import { Component, OnInit } from '@angular/core';
import { preferences } from './mock-preferences';
import { Preferences } from '../../../../model/preferences';
import { EnvService } from '../env.service';
import { Observable, of } from 'rxjs';
import { EnvServiceProvider } from '../env.service.provider';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css'],
  providers: [ EnvServiceProvider ]
})
export class PreferencesComponent implements OnInit {

  preferences: Preferences = {dailyLimit: 2100};

  constructor(public envService: EnvService) {
    this.envService = envService;
   }

  ngOnInit(): void {
    this.preferences = {dailyLimit: this.envService.dailyLimit};
  }

}
