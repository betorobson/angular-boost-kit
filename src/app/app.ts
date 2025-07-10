import { Component, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FancyButton, TesteClass } from 'angular-boost-kit';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FancyButton],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'angular-boot-kit';
  x = new TesteClass();
  constructor(){
    console.log(this.x.getNumber());
  }
}
