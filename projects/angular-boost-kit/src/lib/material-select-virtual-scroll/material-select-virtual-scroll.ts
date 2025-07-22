import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { ScrollingModule as ExperimentalScrollingModule } from '@angular/cdk-experimental/scrolling';
import { MatFormField, MatLabel, MatOption, MatSelect, MatSelectTrigger } from '@angular/material/select';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialSelectVirtualScrollConfig } from './config.interface';
import { MatProgressBar } from '@angular/material/progress-bar';
import { debounceTime, delay, distinctUntilChanged, merge, of, switchMap } from 'rxjs';
import { MatInput } from '@angular/material/input';
import { FilterData } from '../cdk/text-search';

@Component({
  selector: 'lib-material-select-virtual-scroll',
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
    MatProgressBar
  ],
  templateUrl: './material-select-virtual-scroll.html',
  styleUrl: './material-select-virtual-scroll.css'
})
export class MaterialSelectVirtualScroll implements OnInit {

  protected itemSelected: any;
  protected loading = false;

  protected formControlSearch = new FormControl<string>('');

  @Input({required: true}) config: MaterialSelectVirtualScrollConfig;

	@Input() optionTemplate: TemplateRef<any>;
	@Input() triggerTemplate: TemplateRef<any>;

	@ViewChild(CdkVirtualScrollViewport, { static: false })
		cdkVirtualScrollViewPort: CdkVirtualScrollViewport;

  protected options: Array<any> = [];
  private rawOptions: Array<any> = [];

  ngOnInit(): void {
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
        this.rawOptions.push(...result);
        this.options.push(...result);
        this.itemSelectBasedOnFormControlvalue();
        this.loading = false;
        loadSubscriber?.unsubscribe();
      }
    )
  }

  private search(){
    this.formControlSearch.valueChanges
    .pipe(
      debounceTime(200),
      distinctUntilChanged()
    )
    .subscribe(keyword => {
      this.options = FilterData(
        keyword,
        this.rawOptions,
        this.config.optionItemDescription.toString()
      )
    });
  }

  private initPopulateBasedOn(){
    if(this.config.populateBasedOnFormControls){

      const allBaseOnFormControlsHasValue = this.allBaseOnFormControlsHasValue();

      this.config.formControl.setValue(null);

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
    this.options.splice(0);
    if(allBaseOnFormControlsHasValue){
      this.load();
    }
  }

  private subscribeFromControl(){
    // [todo] auto unsubscribe
    this.config.formControl.valueChanges.subscribe(() => {
      this.itemSelectBasedOnFormControlvalue();
    })
  }

  itemSelectBasedOnFormControlvalue(){
    const formControlValue = this.config.formControl.value;
    if(formControlValue){
      this.itemSelect(
        this.options.find(
          option => option[this.config.optionItemId] === formControlValue
        )
      )
    }
  }

  itemSelect(item: any){
    this.itemSelected = item;
  }

  protected openedChange(){
    this.openedChangeCDKVirtualScroll();
  }

  private openedChangeCDKVirtualScroll(){
    if(this.cdkVirtualScrollViewPort){
      this.cdkVirtualScrollViewPort.checkViewportSize();
    }
  }

}
