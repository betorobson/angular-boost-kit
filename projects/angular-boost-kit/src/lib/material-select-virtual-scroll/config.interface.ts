import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";

export interface MaterialSelectVirtualScrollConfig<
  T = any
> {
  formControl: FormControl;
  multiple?: boolean;
  hideResetOption?: boolean;
  replaceArrowByResetButton?: boolean;
  load: () => Observable<Array<T>>;
  populateBasedOnFormControls?: FormControl[];
  optionItemDescription: keyof T;
  compositeId?: Array<Extract<keyof T, string>>;
}
