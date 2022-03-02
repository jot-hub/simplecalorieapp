import { Component } from '@angular/core';
import { EnvService } from './env.service';
import { EnvServiceProvider } from './env.service.provider';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [EnvServiceProvider]
})
export class AppComponent {
  title = 'Simple Calorie App';

  constructor(public envService: EnvService) {
    console.log(JSON.stringify(envService));
  }
}
