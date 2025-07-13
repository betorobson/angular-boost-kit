import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { ScrollingModule as ExperimentalScrollingModule } from '@angular/cdk-experimental/scrolling';
import { MatFormField, MatLabel, MatOption, MatSelect, MatSelectTrigger } from '@angular/material/select';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialSelectVirtualScrollConfig } from './config.interface';

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
  protected loading = false;

  @Input({required: true}) config: MaterialSelectVirtualScrollConfig | undefined;

  @Input({required: true}) formControl = new FormControl<number | null>(null);

	@Input() optionTemplate: TemplateRef<any> | undefined;
	@Input() triggerTemplate: TemplateRef<any> | undefined;

	@ViewChild(CdkVirtualScrollViewport, { static: false })
		cdkVirtualScrollViewPort: CdkVirtualScrollViewport | undefined;

  protected options: Array<any> = [];

  ngOnInit(): void {
    this.load();
  }

  private load(){
    this.loading = true;
    const loadSubscriber = this.config?.load().subscribe(
      result => {
        this.options.push(...result);
        this.loading = false;
        loadSubscriber?.unsubscribe();
      }
    )
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
