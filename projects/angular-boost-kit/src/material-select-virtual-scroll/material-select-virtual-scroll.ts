import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { ScrollingModule as ExperimentalScrollingModule } from '@angular/cdk-experimental/scrolling';
import { MatFormField, MatLabel, MatOption, MatSelect, MatSelectTrigger, MatSuffix } from '@angular/material/select';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialSelectVirtualScrollConfig, OptionMetaData } from './config.interface';
import { MatProgressBar } from '@angular/material/progress-bar';
import { debounceTime, delay, distinctUntilChanged, merge, of, switchMap } from 'rxjs';
import { MatInput } from '@angular/material/input';
import { FilterData } from '../cdk/helpers/text-search';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatOptionSelectionChange } from '@angular/material/core';
import { CdkBoostKitTemplateType } from '../cdk/public-api';

@Component({
  selector: 'boostkit-material-select-virtual-scroll',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ScrollingModule,
    ExperimentalScrollingModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatSelect,
    MatSelectTrigger,
    MatOption,
    MatProgressBar,
    MatIconButton,
    MatIcon,
    MatSuffix,
    CdkBoostKitTemplateType
  ],
  templateUrl: './material-select-virtual-scroll.html',
  styleUrl: './material-select-virtual-scroll.css'
})
export class MaterialSelectVirtualScroll implements OnInit {

  protected templateDataOptionMeta: OptionMetaData;
  protected templateDataMultipleOptionMeta: OptionMetaData[];

  protected itemSelected: any[] = [];
  protected loading = false;

  protected formControlSearch = new FormControl<string>('');

  protected hasValue = false;
  protected isCompositeId = false;

  @Input({required: true}) config: MaterialSelectVirtualScrollConfig;

	@Input() optionTemplate: TemplateRef<any>;
	@Input() triggerTemplate: TemplateRef<any>;

  @ViewChild('inputSearch') private inputSearch: ElementRef<HTMLInputElement>;

	@ViewChild(CdkVirtualScrollViewport, { static: false })
		private cdkVirtualScrollViewPort: CdkVirtualScrollViewport;

  protected options: Array<OptionMetaData> = [];
  private rawOptions: Array<OptionMetaData> = [];

  ngOnInit(): void {
    this.isCompositeId = this.config.compositeId.length > 1;
    if(!this.config.populateBasedOnFormControls){
      this.load();
    }
    this.subscribeFromControl();
    this.initPopulateBasedOn();
    this.search();
  }

  private load(){
    this.loading = true;
    const loadSubscriber = this.config?.load().subscribe(
      result => {
        this.rawOptions.splice(0);
        this.options.splice(0);
        this.mapLoadResultIntoORawOptions(result);
        this.searchPopulate('');
        this.itemSelectBasedOnFormControlvalue();
        this.loading = false;
        this.config.formControl.enable();
        loadSubscriber?.unsubscribe();
      }
    )
  }

  private mapLoadResultIntoORawOptions(result: any[]){

    const optionMetaData: OptionMetaData[] = result.map<OptionMetaData>(item => {
      return {
        id: Object.fromEntries(
          (this.config.compositeId).map(
            key => [key, item[key]]
          )
        ),
        data: item
      }
    });

    this.rawOptions.push(...optionMetaData);

  }

  private search(){
    this.formControlSearch.valueChanges
    .pipe(
      debounceTime(200),
      distinctUntilChanged()
    )
    .subscribe(keyword => this.searchPopulate(keyword));
  }

  private searchPopulate(keyword: string){
    if(!keyword){
      this.options.push(...this.rawOptions);
    }else{
      // [todo] search into metaData.data
      this.options = FilterData(
        keyword,
        this.rawOptions,
        this.config.optionItemDescription.toString()
      )
    }
  }

  private initPopulateBasedOn(){
    if(this.config.populateBasedOnFormControls){

      const allBaseOnFormControlsHasValue = this.allBaseOnFormControlsHasValue();

      this.config.formControl.setValue(null);
      this.config.formControl.disable();

      if(allBaseOnFormControlsHasValue){
        this.load();
      }

      // [todo] auto unsubscribe
      merge.apply(
        this,
        this.config.populateBasedOnFormControls.map(
          formControl => formControl.valueChanges
        )
      ).subscribe(
        () => {
          this.populateBasedOnValueChangesResult();
        }
      );

    }
  }

  private allBaseOnFormControlsHasValue(){
		return !this.config.populateBasedOnFormControls?.find(
			formControl => formControl.getRawValue() === null
		);
	}

  private populateBasedOnValueChangesResult(){
    const allBaseOnFormControlsHasValue = this.allBaseOnFormControlsHasValue();
    this.config.formControl.setValue(null);
    this.options = [];
    this.config.formControl.disable();
    if(allBaseOnFormControlsHasValue){
      this.load();
    }
  }

  private subscribeFromControl(){

    if(this.config.multiple && Array.isArray(this.config.formControl.value)){
      this.multipleArrayValues.splice(0);
      this.multipleArrayValues.push(...this.config.formControl.value);
    }

    // [todo] auto unsubscribe
    this.config.formControl.valueChanges.subscribe(() => {

      this.itemSelectBasedOnFormControlvalue();
      this.setHasValue();

      if(
        this.config.multiple
        &&
        Array.isArray(this.config.formControl.value)
        &&
        this.config.formControl.value.length === 0
      ){
        this.config.formControl.setValue(null, {emitEvent: false});
        this.setHasValue();
      }

    })
  }

  private setHasValue(){
    if(this.config.multiple){
      this.hasValue = Array.isArray(this.config.formControl.value)
      &&
      !!this.config.formControl.value.length
      &&
      !!this.itemSelected.length;
    }else{
      this.hasValue = !!this.config.formControl.value
      &&
      !!this.itemSelected.length;
    }
  }

  itemSelectBasedOnFormControlvalue(){

    const formControlValue = this.config.formControl.value;

    if(formControlValue){
      if(this.config.multiple && Array.isArray(formControlValue)){
        this.itemSelect(
          this.options.filter(
            option => formControlValue.find(
              formControlvalueItem => JSON.stringify(formControlvalueItem) === JSON.stringify(option.id)
            )
          )
        )
      }else if(!this.config.multiple && !Array.isArray(formControlValue)){
        if(this.config.compositeId){
          this.itemSelect(
            this.options.filter(
              option => this.isOptionItemSameOfCompositeId(option, formControlValue)
            )
          )
        }else{
          this.itemSelect(
            this.options.filter(
              option => option.id[this.config.compositeId[0]] === formControlValue
            )
          )
        }
      }
    }else{
      this.itemSelect(null);
    }
  }

  private isOptionItemSameOfCompositeId(optionItem: OptionMetaData, compositiIdValue: any){
    if(this.config.compositeId.length === 1){
      return optionItem.id[this.config.compositeId[0]] === compositiIdValue;
    }else{
      return !Object.entries(compositiIdValue as Partial<OptionMetaData['data']>).some(([key, value]) => {
        return optionItem.id[key] !== value
      })
    }
  }

  itemSelect(items: any[]){
    this.itemSelected.splice(0);
    if(items && items.length){
      this.itemSelected.push(...items);
    }
  }

  getItemValue(optionItem: OptionMetaData){
    if(this.config.compositeId.length === 1){
      return optionItem.id[this.config.compositeId[0]];
    }else{
      return optionItem.id;
    }
    // if(this.config.compositeId){
    //   return Object.fromEntries(
    //     this.config.compositeId.map(
    //       key => [key, optionItem[key]]
    //     )
    //   )
    // }else{
    //   return optionItem.id[this.config.compositeId[0]]
    // }
  }

  reset($event: MouseEvent){
    $event.stopPropagation();
    this.config.formControl.setValue(null);
    this.multipleArrayValues.splice(0);
  }

  multipleArrayValues: number[] = [];
  protected optionSelect(optionItem: OptionMetaData){
    // [todo] multiple of compositeId having two or more keys
    if(this.config.multiple){

      let optionId;
      let isOptionSelectedAtIndex = -1;

      if(this.config.compositeId.length > 1){

        optionId = optionItem.id;

        const optionItemIdValues = JSON.stringify(optionItem.id);

        isOptionSelectedAtIndex = this.multipleArrayValues.findIndex(
          value => {
            return JSON.stringify(value) === optionItemIdValues
          }
        )

      }else{

        optionId = optionItem.id[this.config.compositeId[0]];

        isOptionSelectedAtIndex = this.multipleArrayValues.indexOf(optionId);

      }

      if(isOptionSelectedAtIndex < 0){
        this.multipleArrayValues.push(optionId);
      }else{
        this.multipleArrayValues.splice(isOptionSelectedAtIndex, 1);
      }

      this.config.formControl.setValue(this.multipleArrayValues, {emitEvent: false});

      this.itemSelectBasedOnFormControlvalue();

    }
  }

  protected openedChange(){
    this.openedChangeCDKVirtualScroll();
  }

  protected opened(){
    setTimeout(() => this.inputSearch.nativeElement.focus());
  }

  private openedChangeCDKVirtualScroll(){
    if(this.cdkVirtualScrollViewPort){
      this.cdkVirtualScrollViewPort.checkViewportSize();
      if(this.itemSelected?.[0]){
        const index = this.options.findIndex(
          option => option.id[this.config.compositeId[0]] === this.itemSelected[0][this.config.compositeId[0]]
        )
        this.cdkVirtualScrollViewPort.scrollToIndex(index);
      }
    }
  }

}
