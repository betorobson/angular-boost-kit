import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { ScrollingModule as ExperimentalScrollingModule } from '@angular/cdk-experimental/scrolling';
import { MatFormField, MatLabel, MatOption, MatSelect, MatSelectTrigger } from '@angular/material/select';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

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
    MatOption
  ],
  templateUrl: './material-select-virtual-scroll.html',
  styleUrl: './material-select-virtual-scroll.css'
})
export class MaterialSelectVirtualScroll implements OnInit {

  protected itemSelected: any;

  @Input({required: true}) formControl = new FormControl<number | null>(null);

	@Input() optionTemplate: TemplateRef<any> | undefined;
	@Input() triggerTemplate: TemplateRef<any> | undefined;

	@ViewChild(CdkVirtualScrollViewport, { static: false })
		cdkVirtualScrollViewPort: CdkVirtualScrollViewport | undefined;

  protected options = Array.from({length: 1000}).map((value, index) => ({
    id: index + 1,
    desc: `Item ${index + 1}`
  }))

  ngOnInit(): void {

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
