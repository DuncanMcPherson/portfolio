import { ChangeDetectorRef } from "@angular/core";
import { Subject } from "rxjs";
import { autoMockerInstance } from "../../../../test-utils/auto-mocker-plus";
import { createFormHelperServiceMock } from "../../../../test-utils/mock-factories/form-helper-service.mock-factory";
import { readObservableSynchronously } from "../../../../test-utils/read-observable-synchronously";
import { ErrorMessageConfigService as ErrorMessageConfig } from "../../services/error-message-config.service";
import { FormHelperService } from "../../services/form-helper.service";
import { FieldValidationComponent } from "./field-validation.component";

describe('FieldValidationComponent', () => {
	let control: any;
	let valueChangesSubject: Subject<string>;
	let statusChangesSubject: Subject<string>;

	let fieldName: string;
	let errorMessageConfigMock: ErrorMessageConfig;
	let changeDetectorRefMock: ChangeDetectorRef;
	let formHelperServiceMock: FormHelperService;
	let touchedSubject: Subject<boolean>;

	beforeEach(() => {
		control = jasmine.createSpyObj("control", ['markAsTouched', 'markAsUntouched']);
		valueChangesSubject = new Subject<string>();
		statusChangesSubject = new Subject<string>();
		control.valueChanges = valueChangesSubject;
		control.statusChanges = statusChangesSubject;

		fieldName = chance.string();
		errorMessageConfigMock = {} as ErrorMessageConfig;
		errorMessageConfigMock[fieldName] = {
			required: chance.string(),
			dontCare: ErrorMessageConfig.DO_NOT_SHOW_ANY_ERROR_MESSAGE
		};

		changeDetectorRefMock = jasmine.createSpyObj('changeDetectorRef', ['detectChanges']);
		formHelperServiceMock = createFormHelperServiceMock();
		touchedSubject = autoMockerInstance.withReturnSubjectAsObservable(
			formHelperServiceMock.extractTouchedChanges
		);
	});

	function createFieldValidationComponent(): FieldValidationComponent {
		return new FieldValidationComponent(
			errorMessageConfigMock,
			changeDetectorRefMock,
			formHelperServiceMock
		);
	}

	describe('valueChange', () => {
		let component: FieldValidationComponent;

		beforeEach(() => {
			component = createFieldValidationComponent();
			component.fieldName = fieldName;
			component.control = control;

			component.ngOnInit();
		});

		it('should set error message when validation fails and control is touched', () => {
			control.touched = true;
			control.errors = {
				required: {}
			};
			const expectedErrorMessage = errorMessageConfigMock[fieldName].required;

			valueChangesSubject.next("");
			statusChangesSubject.next("");

			const errorMessage = readObservableSynchronously(component.errorMessages$);
			expect(errorMessage).toBe(expectedErrorMessage);
		});

		it('should clear error message when control is valid and touched', () => {
			control.touched = true;
			control.errors = null;
			component['errorMessages$$'].next('ManU is the error');

			valueChangesSubject.next('');
			statusChangesSubject.next('');

			const errorMessage = readObservableSynchronously(component.errorMessages$);
			expect(errorMessage).toBe('');
		});
	})
})
