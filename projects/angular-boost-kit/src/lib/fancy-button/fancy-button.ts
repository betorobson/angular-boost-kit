import { Component } from '@angular/core';
import { TesteClass } from '../sdk/teste-class';

@Component({
  selector: 'lib-fancy-button',
  imports: [],
  templateUrl: './fancy-button.html',
  styleUrl: './fancy-button.css'
})
export class FancyButton {
  constructor(){
    const x = new TesteClass();
    console.log('FancyButton', x.getNumber())
  }
}
