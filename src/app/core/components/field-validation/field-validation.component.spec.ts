import { ChangeDetectorRef } from "@angular/core";
import { Subject } from "rxjs";
import { autoMockerInstance } from "../../../../test-utils/auto-mocker-plus";
import { createFormHelperServiceMock } from "../../../../test-utils/mock-factories/form-helper-service.mock-factory";
import { readObservableSynchronously } from "../../../../test-utils/read-observable-synchronously";
import { ErrorMessageConfigService as ErrorMessageConfig } from "../../services/error-message-config.service";
import { FormHelperService } from "../../services/form-helper.service";
import { FieldValidationComponent } from "./field-validation.component";
import {ComponentFixture, TestBed} from "@angular/core/testing";

describe('FieldValidationComponent', () => {
	let fixture: ComponentFixture<FieldValidationComponent>;
	let component: FieldValidationComponent;
	let control: any;
	let valueChangesSubject: Subject<string>;
	let statusChangesSubject: Subject<string>;

	let fieldName: string;
	let errorMessageConfigMock: ErrorMessageConfig;
	let changeDetectorRefMock: ChangeDetectorRef;
	let formHelperServiceMock: FormHelperService;
	let touchedSubject: Subject<boolean>;

	beforeEach(async () => {
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

		await TestBed.configureTestingModule({
			declarations: [FieldValidationComponent],
			providers: [
				{
					provide: ErrorMessageConfig,
					useValue: errorMessageConfigMock
				},
				{
					provide: FormHelperService,
					useValue: formHelperServiceMock
				}
			]
		}).compileComponents();

		fixture = TestBed.createComponent(FieldValidationComponent);
		component = fixture.componentInstance;
	});

	describe('valueChange', () => {

		beforeEach(() => {
			component.fieldName = fieldName;
			component.control = control;

			fixture.detectChanges();
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

		it('should clear error message when error message is set to do not show and the control is touched', () => {
			control.touched = true;
			control.errors = {
				dontCare: {}
			};
			component["errorMessages$$"].next("ManU is the error")

			valueChangesSubject.next('');
			statusChangesSubject.next('');

			const errorMessage = readObservableSynchronously(component.errorMessages$);
			expect(errorMessage).toEqual('');
		});
	});

	describe('touched', () => {

		beforeEach(() => {
			component.control = control;
			component.fieldName = fieldName;

			fixture.detectChanges();
		});

		it('should set error message when validation fails', () => {
			control.touched = true;
			control.errors = {
				required: {}
			};

			const expectedErrorMessage = errorMessageConfigMock[fieldName].required;
			touchedSubject.next(true);

			const errorMessage = readObservableSynchronously(component.errorMessages$);
			expect(errorMessage).toBe(expectedErrorMessage);
		});

		it('should clear error when the control is valid', () => {
			control.touched = true;
			control.errors = null;
			component["errorMessages$$"].next('ManU is the error');

			touchedSubject.next(true);

			const errorMessage = readObservableSynchronously(component.errorMessages$);
			expect(errorMessage).toBe('');
		})

		it('should clear message when error is set to do not show', () => {
			control.touched = true;
			control.errors = {
				dontCare: {}
			}
			component['errorMessages$$'].next('ManU is the error');

			touchedSubject.next(true);

			const errorMessage = readObservableSynchronously(component.errorMessages$);
			expect(errorMessage).toBe('');
		});
	});

	describe('ngOnDestroy', () => {
		it('should unsubscribe from control observables', () => {
			component.control = control;
			component.fieldName = fieldName;

			fixture.detectChanges()

			expect(component.formControlSubscription.closed).toBe(false);

			fixture.destroy();

			expect(component.formControlSubscription.closed).toBe(true);
		});
	});

	describe('isValid', () => {
		it('should return true if the control is valid and touched', () => {
			component.control = control;
			control.touched = true;
			control.valid = true;
			fixture.detectChanges();

			const result = component.isValid();
			expect(result).toBeTrue();
		});
	});

	describe("isInvalid", () => {
		it("return true if the control is invalid and touched", () => {
			component.control = control;
			control.touched = true;
			control.errors = {
				required: {},
			};
			fixture.detectChanges();

			const result = component.isInvalid();

			expect(result).toBe(true);
		});
	});

	describe("isControlDisabled", () => {
		it("should return true if the control is disabled", () => {
			component.control = control;
			control.disabled = true;
			fixture.detectChanges();

			const result = component.isControlDisabled();

			expect(result).toBe(true);
		});

		it("should return true if the component is disabled through an input", () => {
			component.control = control;
			component.isDisabled = true;
			fixture.detectChanges();

			const result = component.isControlDisabled();

			expect(result).toBe(true);
		});
	});
});
