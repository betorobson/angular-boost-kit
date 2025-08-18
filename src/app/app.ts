import { Component, inject, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { FancyButton, MaterialSelectVirtualScroll, MaterialSelectVirtualScrollConfig, NgTemplateTypeDirective, TesteClass,  } from 'angular-boost-kit';
import { delay, of } from 'rxjs';
import { APICitiesItem, APIStatesCitiesNeighborhoods, APIStatesItem } from './api-services/states-cities-neighborhoods';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule,
    FancyButton,
    MaterialSelectVirtualScroll,
    NgTemplateTypeDirective,
    MatIcon
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

  protected title = 'angular-boot-kit';

  private apiStatesCitiesNeighborhoods = inject(APIStatesCitiesNeighborhoods);

  x = new TesteClass();

  selectVirtualScrollStatesConfig: MaterialSelectVirtualScrollConfig<APIStatesItem> = {
    formControl: new FormControl<string>(null),
    compositeId: ['stateId'],
    optionItemDescription: 'stateName',
    replaceArrowByResetButton: true,
    load: () => this.apiStatesCitiesNeighborhoods.getStates()
  };

  selectVirtualScrollCitiesConfig: MaterialSelectVirtualScrollConfig<APICitiesItem> = {
    formControl: new FormControl<number>(null),
    compositeId: ['cityId'],
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
    compositeId: ['optionChildId'],
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

  selectVirtualScrollMultipleConfig: MaterialSelectVirtualScrollConfig<OptionMulitpleItem> = {
    formControl: new FormControl<number[]>([1,2,26]),
    multiple: true,
    replaceArrowByResetButton: true,
    compositeId: ['optionChildId'],
    optionItemDescription: 'optionChildDesc',
    load: () => {
      return of<OptionMulitpleItem[]>(
        Array.from({length: 1000}).map((value, index) => ({
          optionChildId: index + 1,
          optionChildDesc: `Item ${index + 1}`
        }))
      )
      .pipe(delay(1000))
    }
  };

  selectVirtualScrollCompositeIdConfig: MaterialSelectVirtualScrollConfig<
    OptionCompositeIdExample
  > = {
    // [todo] FormControl Type of compositeId
    formControl: new FormControl<any>(null),
    // multiple: true,
    replaceArrowByResetButton: true,
    optionItemDescription: 'desc',
    compositeId: ['key1', 'key2'],
    load: () => {
      return of<OptionCompositeIdExample[]>(
        (function(){
          const r = [];
          r.push(
            ...Array.from({length: 1000}).map<OptionCompositeIdExample>((value, index) => ({
              key1: 1,
              key2: parseInt(`1${index}`),
              desc: `Item 1: ${index + 1}`
            })),
            ...Array.from({length: 1000}).map<OptionCompositeIdExample>((value, index) => ({
              key1: 2,
              key2: parseInt(`2${index}`),
              desc: `Item 2: ${index + 1}`
            })),
          );
          return r;
        })()
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

export type OptionMulitpleItem = Pick<OptionChildItem, 'optionChildId' | 'optionChildDesc'>;

export interface OptionCompositeIdExample {
  key1: number;
  key2: number;
  desc: string;
}
