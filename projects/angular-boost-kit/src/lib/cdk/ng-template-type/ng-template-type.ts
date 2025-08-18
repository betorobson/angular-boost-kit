import { Directive, Input } from "@angular/core";
import { NgTemplateTypeModel } from "./ng-template-type.interface";

@Directive({
	selector: 'ng-template[templateType]',
	standalone: true
})
export class NgTemplateTypeDirective<T> {

	@Input('templateType') typeToken: T;

	static ngTemplateContextGuard<T>(
		dir: NgTemplateTypeDirective<T>,
		ctx: unknown
	): ctx is NgTemplateTypeModel<T> {
		return true;
	}

}
