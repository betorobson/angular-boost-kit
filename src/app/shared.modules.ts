import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIcon,
    MatListModule,
  ],
  exports: [
    CommonModule,
    MatButtonModule,
    MatIcon,
    MatListModule,
  ]
})

export class SharedModules {}
