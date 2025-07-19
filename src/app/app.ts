import { Component, inject, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { FancyButton, MaterialSelectVirtualScroll, MaterialSelectVirtualScrollConfig, TesteClass,  } from 'angular-boost-kit';
import { delay, of } from 'rxjs';
import { APIStatesCitiesNeighborhoods, APIStatesItem } from './api-services/states-cities-neighborhoods';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FancyButton, MaterialSelectVirtualScroll],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

  protected title = 'angular-boot-kit';

  private apiStatesCitiesNeighborhoods = inject(APIStatesCitiesNeighborhoods);

  x = new TesteClass();

  selectVirtualScrollConfig: MaterialSelectVirtualScrollConfig<APIStatesItem> = {
    formControl: new FormControl<number>(2),
    optionItemId: 'stateId',
    optionItemDescription: 'stateName',
    load: () => this.apiStatesCitiesNeighborhoods.getStates()
  };

  selectVirtualScrollConfig2: MaterialSelectVirtualScrollConfig<OptionChildItem> = {
    formControl: new FormControl<number>(null),
    optionItemId: 'optionChildId',
    optionItemDescription: 'optionChildDesc',
    populateBasedOnFormControls: [
      this.selectVirtualScrollConfig.formControl
    ],
    load: () => {
      const parentsId = [
        this.selectVirtualScrollConfig.formControl.value
      ];
      return of<OptionChildItem[]>(
        Array.from({length: 1000}).map((value, index) => ({
          optionParentId: parentsId.join(','),
          optionChildId: index + 1,
          optionChildDesc: `Parent ${parentsId.join(',')} | Item ${index + 1}`
        }))
      )
      .pipe(delay(1000))
    }
  };

  selectVirtualChildScrollConfig: MaterialSelectVirtualScrollConfig<OptionChildItem> = {
    formControl: new FormControl<number>(null),
    optionItemId: 'optionChildId',
    optionItemDescription: 'optionChildDesc',
    populateBasedOnFormControls: [
      this.selectVirtualScrollConfig.formControl,
      this.selectVirtualScrollConfig2.formControl
    ],
    load: () => {
      const parentsId = [
        this.selectVirtualScrollConfig.formControl.value,
        this.selectVirtualScrollConfig2.formControl.value
      ];
      return of<OptionChildItem[]>(
        Array.from({length: 1000}).map((value, index) => ({
          optionParentId: parentsId.join(','),
          optionChildId: index + 1,
          optionChildDesc: `Parent ${parentsId.join(',')} | Item ${index + 1}`
        }))
      )
      .pipe(delay(1000))
    }
  };

  constructor(){
    console.log(this.x.getNumber());
  }

  protected setSelectVirtualScrollFormControlValue(id: number){
    this.selectVirtualScrollConfig.formControl.setValue(id);
  }

}

export interface OptionItem {
  optionId: number,
  optionDesc: string
}

export interface OptionChildItem {
  optionParentId: string,
  optionChildId: number,
  optionChildDesc: string
}
