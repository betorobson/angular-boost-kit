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

  selectVirtualScrollConfig: MaterialSelectVirtualScrollConfig<OptionItem> = {
    formControl: new FormControl<number>(2),
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

  protected setSelectVirtualScrollFormControlValue(id: number){
    this.selectVirtualScrollConfig.formControl.setValue(id);
  }

}

export interface OptionItem {
  id: number,
  desc: string
}
