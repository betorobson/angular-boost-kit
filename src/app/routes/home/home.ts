import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SharedModules } from '../../shared.modules';

@Component({
  selector: 'app-home',
  imports: [SharedModules, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
