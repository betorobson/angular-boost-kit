import { Directive, Input } from "@angular/core";
import { BoostKitTemplateType } from "./template-type.interface";

@Directive({
	selector: 'ng-template[boostkit-template-type]',
	standalone: true
})
export class CdkBoostKitTemplateType<T> {

	@Input('templateType') typeToken: T;

	static ngTemplateContextGuard<T>(
		dir: CdkBoostKitTemplateType<T>,
		ctx: unknown
	): ctx is BoostKitTemplateType<T> {
		return true;
	}

}
