import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { FancyButton, MaterialSelectVirtualScroll, TesteClass } from 'angular-boost-kit';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FancyButton, MaterialSelectVirtualScroll],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

  protected title = 'angular-boot-kit';

  x = new TesteClass();

  selectVirtualScrollFormControl = new FormControl<number | null>(null);

  constructor(){
    console.log(this.x.getNumber());
  }

}
