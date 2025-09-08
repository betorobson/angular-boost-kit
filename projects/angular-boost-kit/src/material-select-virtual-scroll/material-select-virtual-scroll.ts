import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { ScrollingModule as ExperimentalScrollingModule } from '@angular/cdk-experimental/scrolling';
import { MatFormField, MatLabel, MatOption, MatSelect, MatSelectTrigger, MatSuffix } from '@angular/material/select';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialSelectVirtualScrollConfig, OptionMetaData } from './config.interface';
import { MatProgressBar } from '@angular/material/progress-bar';
import { debounceTime, delay, distinctUntilChanged, map, merge, of, switchMap, tap } from 'rxjs';
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

  protected itemSelected: OptionMetaData[] = [];
  protected loading = false;

  protected formControlSearch = new FormControl<string>('');

  protected hasValue = false;
  protected isCompositeId = false;

  @Input({required: true}) config: MaterialSelectVirtualScrollConfig;

	@Input() optionTemplate: TemplateRef<any>;
	@Input() triggerTemplate: TemplateRef<any>;

  @ViewChild('inputSearch') private inputSearch: ElementRef<HTMLInputElement>;

  @ViewChild(MatSelect) private set matSelect(matSelect: MatSelect){
    if(matSelect){
      matSelect.ngControl.control.addAsyncValidators(() => of(null).pipe(
        delay(100),
        map(() => this.config.formControl.errors)
      ));
    }
  }

	@ViewChild(CdkVirtualScrollViewport, { static: false })
		private cdkVirtualScrollViewPort: CdkVirtualScrollViewport;

  protected options: Array<OptionMetaData> = [];
  private rawOptions: Array<OptionMetaData> = [];
  protected model: any;

  ngOnInit(): void {
    this.isCompositeId = this.config.compositeId.length > 1;
    if(!this.config.populateBasedOnFormControls){
      this.load();
    }
    this.subscribeFromControl();
    this.initPopulateBasedOn();
    this.compositeIdPopulateFormGroupWatchValidators();
    this.search();
  }

  private load(){
    this.loading = true;
    const loadSubscriber = this.config?.load().subscribe(
      result => {
        this.rawOptions.splice(0);
        this.options.splice(0);
        this.mapLoadResultIntoRawOptions(result);
        this.searchPopulate('');
        this.itemSelectBasedOnFormControlvalue();
        this.loading = false;
        this.config.formControl.enable();
        loadSubscriber?.unsubscribe();
      }
    )
  }

  private compositeIdPopulateFormGroupWatchValidators(){
    if(this.isCompositeId && this.config.compositeIdPopulateFormGroup){
      const formControlsBasedOnSameCompositeIdKeys = this.config.compositeId.map<FormControl>(
        key => this.config.compositeIdPopulateFormGroup.controls[key]as FormControl
      )
      formControlsBasedOnSameCompositeIdKeys.forEach(
        formControl => formControl.addValidators(
          () => this.config.formControl.errors
        )
      )
    }
  }

  private mapLoadResultIntoRawOptions(result: any[]){

    const optionMetaData: OptionMetaData[] = result.map<OptionMetaData>(item => {
      const optionMetaData = {
        selected: false,
        id: Object.fromEntries(
          (this.config.compositeId).map(
            key => [key, item[key]]
          )
        ),
        data: item
      };
      this.isItemSelectedInFormControl(optionMetaData)
      return optionMetaData;
    });

    this.rawOptions.push(...optionMetaData);

  }

  private isItemSelectedInFormControl(optionMetaData: OptionMetaData){

    const formControlValue = this.config.formControl.value;


    if(this.config.multiple){

      if(!Array.isArray(formControlValue)){
        return;
      }

      if(this.config.compositeId.length === 1){
        optionMetaData.selected = formControlValue.includes(this.getItemValue(optionMetaData));
      }else{
        optionMetaData.selected = !!formControlValue.find(
          item => JSON.stringify(item) === JSON.stringify(this.getItemValue(optionMetaData))
        );
      }

    }else{
      optionMetaData.selected = formControlValue === this.getItemValue(optionMetaData);
    }

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

      this.model = null;
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
    this.config.formControl.setValue(this.config.multiple ? [] : null);
    this.model = (this.config.multiple ? [] : null)
    this.options = [];
    this.config.formControl.disable();
    if(allBaseOnFormControlsHasValue){
      this.load();
    }
  }

  private subscribeFromControl(){

    // [todo] auto unsubscribe
    this.config.formControl.valueChanges.subscribe(() => {

      this.itemSelectBasedOnFormControlvalue();

      if(
        this.config.multiple
        &&
        Array.isArray(this.config.formControl.value)
        &&
        this.config.formControl.value.length === 0
      ){
        this.config.formControl.setValue(this.config.multiple ? [] : null, {emitEvent: false});
      }

      this.setHasValue();

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

    this.rawOptions.forEach(
      option => this.isItemSelectedInFormControl(option)
    );

    if(formControlValue){

      const arrayOfvalues = this.rawOptions.filter(
        item => item.selected
      );

      this.itemSelect(arrayOfvalues);

    }else{
      this.itemSelect(null);
    }

  }

  itemSelect(items: OptionMetaData[]){

    this.itemSelected.splice(0);

    if(items && items.length){
      this.itemSelected.push(...items);
    }

    if(this.config.multiple){
      this.model = items.map(item => this.getItemValue(item));
    }

    this.compositeIdPopulateFormGroup();

  }

  private compositeIdPopulateFormGroup(){

    if(!this.config.compositeIdPopulateFormGroup){
      return;
    }

    if(this.config.multiple){
      // [todo]
    }else{
      if(this.itemSelected.length){
        this.config.compositeIdPopulateFormGroup.patchValue(this.itemSelected[0].id);
      }else{
        this.config.compositeIdPopulateFormGroup.patchValue(
          Object.fromEntries(
            this.config.compositeId.map<[string, null]>(
              key => [key, null]
            )
          )
        );
      }
    }

  }

  getItemValue(optionItem: OptionMetaData){
    if(this.config.compositeId.length === 1){
      return optionItem.id[this.config.compositeId[0]];
    }else{
      return optionItem.id;
    }
  }

  reset($event: MouseEvent){
    $event.stopPropagation();
    this.config.formControl.setValue(this.config.multiple ? [] : null);
    this.model = null;
  }

  protected optionSelect($event: MouseEvent, optionItem: OptionMetaData){

    $event.preventDefault();
    $event.stopPropagation();

    optionItem.selected = !optionItem.selected;

    if(this.config.multiple){

      this.config.formControl.setValue(
        this.rawOptions.filter(item => item.selected).map(
          item => this.config.compositeId.length === 1
            ? item.id[this.config.compositeId[0]]
            : item.id
        )
      );

    }else{

      this.config.formControl.setValue(
        this.getItemValue(optionItem)
      )

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
          option => option.id[this.config.compositeId[0]] === this.itemSelected[0].id[this.config.compositeId[0]]
        )
        this.cdkVirtualScrollViewPort.scrollToIndex(index);
      }
    }
  }

}
