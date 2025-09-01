import { Directive, Input } from "@angular/core";
import { BoostKitTemplateType } from "./template-type.interface";

@Directive({
	selector: 'ng-template[cdk-boostkit-template-type]',
	standalone: true
})
export class CdkBoostKitTemplateType<T> {

	@Input('cdk-boostkit-template-type') typeToken: T;

	static ngTemplateContextGuard<T>(
		dir: CdkBoostKitTemplateType<T>,
		ctx: unknown
	): ctx is BoostKitTemplateType<T> {
		return true;
	}

}
