import { Component, inject, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { FancyButton, MaterialSelectVirtualScroll, MaterialSelectVirtualScrollConfig, TesteClass,  } from 'angular-boost-kit';
import { delay, of } from 'rxjs';
import { APICitiesItem, APIStatesCitiesNeighborhoods, APIStatesItem } from './api-services/states-cities-neighborhoods';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FancyButton, MaterialSelectVirtualScroll, MatIcon],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

  protected title = 'angular-boot-kit';

  private apiStatesCitiesNeighborhoods = inject(APIStatesCitiesNeighborhoods);

  x = new TesteClass();

  selectVirtualScrollStatesConfig: MaterialSelectVirtualScrollConfig<APIStatesItem> = {
    formControl: new FormControl<string>(null),
    optionItemId: 'stateId',
    optionItemDescription: 'stateName',
    replaceArrowByResetButton: true,
    load: () => this.apiStatesCitiesNeighborhoods.getStates()
  };

  selectVirtualScrollCitiesConfig: MaterialSelectVirtualScrollConfig<APICitiesItem> = {
    formControl: new FormControl<number>(null),
    optionItemId: 'cityId',
    optionItemDescription: 'cityName',
    populateBasedOnFormControls: [
      this.selectVirtualScrollStatesConfig.formControl
    ],
    load: () => this.apiStatesCitiesNeighborhoods.getCities(
      this.selectVirtualScrollStatesConfig.formControl.value
    )
  };

  selectVirtualChildScrollConfig: MaterialSelectVirtualScrollConfig<OptionChildItem> = {
    formControl: new FormControl<number>(null),
    optionItemId: 'optionChildId',
    optionItemDescription: 'optionChildDesc',
    populateBasedOnFormControls: [
      this.selectVirtualScrollStatesConfig.formControl,
      this.selectVirtualScrollCitiesConfig.formControl
    ],
    load: () => {
      const parentsId = [
        this.selectVirtualScrollStatesConfig.formControl.value,
        this.selectVirtualScrollCitiesConfig.formControl.value
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
    this.selectVirtualScrollStatesConfig.formControl.setValue(id);
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
