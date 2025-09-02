import { Component, inject, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { CdkBoostKitTemplateType, MaterialSelectVirtualScroll, MaterialSelectVirtualScrollConfig  } from 'angular-boost-kit';
import { delay, of } from 'rxjs';
import { APICitiesItem, APIStatesCitiesNeighborhoods, APIStatesItem } from './routes/select-virtual-scroll/api-services/states-cities-neighborhoods';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { SharedModules } from './shared.modules';

@Component({
  selector: 'app-root',
  imports: [
    SharedModules,
    RouterModule,
    RouterOutlet
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

  constructor(){}

}
