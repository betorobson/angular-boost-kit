import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";

export interface MaterialSelectVirtualScrollConfig<T = any> {
  formControl: FormControl<number>;
  load: () => Observable<Array<T>>;
  populateBasedOnFormControls?: FormControl[];
  optionItemId: keyof T;
  optionItemDescription: keyof T;
}
