import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { FancyButton, MaterialSelectVirtualScroll, MaterialSelectVirtualScrollConfig, TesteClass,  } from 'angular-boost-kit';
import { delay, of } from 'rxjs';

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

  selectVirtualScrollConfig: MaterialSelectVirtualScrollConfig<OptionItem> = {
    load: () => of(
        Array.from({length: 1000}).map((value, index) => ({
          id: index + 1,
          desc: `Item ${index + 1}`
        }))
      )
      .pipe(delay(1000))
  };

  constructor(){
    console.log(this.x.getNumber());
  }

}

export interface OptionItem {
  id: number,
  desc: string
}
