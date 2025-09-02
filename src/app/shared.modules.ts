import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";

@NgModule({
  imports: [
    CommonModule,
    MatIcon,
    MatListModule,
  ],
  exports: [
    CommonModule,
    MatIcon,
    MatListModule,
  ]
})

export class SharedModules {}
