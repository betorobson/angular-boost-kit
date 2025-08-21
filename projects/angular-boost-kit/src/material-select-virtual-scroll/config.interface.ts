import { FormControl, FormGroup } from "@angular/forms";
import { Observable } from "rxjs";

export interface MaterialSelectVirtualScrollConfig<
  T = any
> {
  templateDataOptionMeta?: OptionMetaData<T>,
  templateDataMultipleOptionMeta?: OptionMetaData<T>[],
  formControl: FormControl;
  multiple?: boolean;
  hideResetOption?: boolean;
  replaceArrowByResetButton?: boolean;
  load: () => Observable<Array<T>>;
  populateBasedOnFormControls?: FormControl[];
  optionItemDescription: keyof T;
  compositeId?: Array<Extract<keyof T, string>>;
  compositeIdPopulateFormGroup?: FormGroup;
}

export interface OptionMetaData<T = any> {
  id: Partial<T>;
  data: T;
}
