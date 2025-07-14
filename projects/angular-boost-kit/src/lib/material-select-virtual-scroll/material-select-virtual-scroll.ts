import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { ScrollingModule as ExperimentalScrollingModule } from '@angular/cdk-experimental/scrolling';
import { MatFormField, MatLabel, MatOption, MatSelect, MatSelectTrigger } from '@angular/material/select';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialSelectVirtualScrollConfig } from './config.interface';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: 'lib-material-select-virtual-scroll',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ScrollingModule,
    ExperimentalScrollingModule,
    MatFormField,
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

  @Input({required: true}) config: MaterialSelectVirtualScrollConfig;

	@Input() optionTemplate: TemplateRef<any>;
	@Input() triggerTemplate: TemplateRef<any>;

	@ViewChild(CdkVirtualScrollViewport, { static: false })
		cdkVirtualScrollViewPort: CdkVirtualScrollViewport;

  protected options: Array<any> = [];

  ngOnInit(): void {
    this.load();
  }

  private load(){
    this.loading = true;
    const loadSubscriber = this.config?.load().subscribe(
      result => {
        this.options.push(...result);
        this.itemSelectBasedOnFormControlvalue();
        this.loading = false;
        loadSubscriber?.unsubscribe();
      }
    )
  }

  itemSelectBasedOnFormControlvalue(){
    const formControlValue = this.config.formControl.value;
    if(formControlValue){
      this.itemSelect(
        this.options.find(
          option => option.id === formControlValue
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
