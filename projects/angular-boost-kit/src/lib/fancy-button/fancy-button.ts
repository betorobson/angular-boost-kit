import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TesteClass } from '../cdk/teste-class';

@Component({
  selector: 'lib-fancy-button',
  imports: [MatButtonModule],
  templateUrl: './fancy-button.html',
  styleUrl: './fancy-button.css'
})
export class FancyButton {
  constructor(){
    const x = new TesteClass();
    console.log('111FancyButton', x.getNumber())
  }
}
