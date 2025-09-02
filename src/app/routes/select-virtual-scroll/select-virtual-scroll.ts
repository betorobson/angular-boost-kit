import { Component, inject } from '@angular/core';
import { CdkBoostKitTemplateType, MaterialSelectVirtualScroll, MaterialSelectVirtualScrollConfig } from 'angular-boost-kit';
import { APICitiesItem, APIStatesCitiesNeighborhoods, APIStatesItem } from './api-services/states-cities-neighborhoods';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { delay, of } from 'rxjs';
import { SharedModules } from '../../shared.modules';

@Component({
  selector: 'app-select-virtual-scroll',
  imports: [
    SharedModules,
    MaterialSelectVirtualScroll,
    CdkBoostKitTemplateType,
  ],
  templateUrl: './select-virtual-scroll.html',
  styleUrl: './select-virtual-scroll.scss'
})
export class SelectVirtualScroll {

  private apiStatesCitiesNeighborhoods = inject(APIStatesCitiesNeighborhoods);

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

  formGroupComposite = new FormGroup({
    key1: new FormControl<number>(null),
    key2: new FormControl<number>(null),
  });

  selectVirtualScrollCompositeIdConfig: MaterialSelectVirtualScrollConfig<
    OptionCompositeIdExample
  > = {
    // [todo] FormControl Type of compositeId
    formControl: new FormControl<any>(null, {
      validators: [
        Validators.required,
        () => (this.selectVirtualScrollCompositeIdConfig?.formControl
          .value as Pick<OptionCompositeIdExample, | 'key1' | 'key2'>)?.key2 % 2 === 0
            ? { invalidIdNumber: true }
            : null
      ]
    }),
    // multiple: true,
    replaceArrowByResetButton: true,
    optionItemDescription: 'desc',
    compositeIdPopulateFormGroup: this.formGroupComposite,
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

  selectVirtualScrollMultipleCompositeIdConfig: MaterialSelectVirtualScrollConfig<
    OptionCompositeIdExample
  > = {
    // [todo] FormControl Type of compositeId
    formControl: new FormControl<any[]>([ { "key1": 1, "key2": 10 }, { "key1": 1, "key2": 12 } ]),
    multiple: true,
    replaceArrowByResetButton: true,
    optionItemDescription: 'desc',
    compositeId: ['key1', 'key2'],
    load: () => {
      return of<OptionCompositeIdExample[]>(
        (function(){
          const r = [];
          r.push(
            ...Array.from({length: 10}).map<OptionCompositeIdExample>((value, index) => ({
              key1: 1,
              key2: parseInt(`1${index}`),
              desc: `Item 1: ${index + 1}`
            })),
            ...Array.from({length: 10}).map<OptionCompositeIdExample>((value, index) => ({
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
  optionChildDesc: string,
}

export type OptionMulitpleItem = Pick<OptionChildItem, 'optionChildId' | 'optionChildDesc'>;

export interface OptionCompositeIdExample {
  key1: number;
  key2: number;
  desc: string;
}
