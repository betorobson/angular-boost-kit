import { Observable } from "rxjs";

export interface MaterialSelectVirtualScrollConfig<T = any> {
  load: () => Observable<Array<T>>
}
