import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";

export interface MaterialSelectVirtualScrollConfig<T = any> {
  formControl: FormControl;
  hideResetOption?: boolean;
  replaceArrowByResetButton?: boolean;
  load: () => Observable<Array<T>>;
  populateBasedOnFormControls?: FormControl[];
  optionItemId: keyof T;
  optionItemDescription: keyof T;
}
