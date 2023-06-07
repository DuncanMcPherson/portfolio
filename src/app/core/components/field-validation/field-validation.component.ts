import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	ElementRef,
	Input,
	OnDestroy,
	OnInit,
	ViewChild
} from '@angular/core';
import {FormControl, ValidationErrors} from "@angular/forms";
import {BehaviorSubject, distinctUntilChanged, filter, map, merge, Observable, Subscription} from "rxjs";
import some from "lodash-es/some";
import { ErrorMessageConfigService as ErrorMessageConfig } from "../../services/error-message-config.service";
import {FormHelperService} from "../../services/form-helper.service";

@Component({
	selector: 'app-field-validation',
	templateUrl: './field-validation.component.html',
	styleUrls: ['./field-validation.component.scss']
})
export class FieldValidationComponent implements OnInit, OnDestroy, AfterViewInit {
	@Input() public fieldName: string;
	@Input() public control: FormControl;
	@Input() public showErrorOverride = true;
	@Input() public isCustomSelect?: boolean = false;
	@Input() public isDisabled?: boolean = false;
	@ViewChild('contentWrapper')
	public contentWrapper: ElementRef;
	public formControlSubscription: Subscription;

	private errorMessages$$: BehaviorSubject<string> = new BehaviorSubject<string>('');
	public errorMessages$: Observable<string> = this.errorMessages$$.asObservable();
	public showValidationIcon: boolean;
	private errorList: string[];

	constructor(
		private errorMessageConfigService: ErrorMessageConfig,
		private changeDetectorRef: ChangeDetectorRef,
		private readonly formHelperService: FormHelperService
	) {
	}

	public ngOnInit(): void {
		this.errorList = this.errorMessageConfigService[this.fieldName] || [];
		const touched$ = this.formHelperService.extractTouchedChanges(this.control);

		this.formControlSubscription = merge(
			touched$,
			this.control.valueChanges,
			this.control.statusChanges
		).pipe(
			filter(() => this.control.touched),
			map(() => this.getErrorMessage()),
			distinctUntilChanged()
		)
			.subscribe((errorMessage) => {
				this.changeDetectorRef.detectChanges();

				if (!errorMessage || errorMessage === ErrorMessageConfig.DO_NOT_SHOW_ANY_ERROR_MESSAGE) {
					this.errorMessages$$.next('');
					return;
				}

				this.errorMessages$$.next(errorMessage);
			})
	}

	public ngOnDestroy(): void {
		this.formControlSubscription.unsubscribe();
	}

	public ngAfterViewInit(): void {
		this.showValidationIcon = some(this.contentWrapper.nativeElement.childNodes, (element) =>
			this.shouldShowValidationIcon(element)
		);
		this.changeDetectorRef.detectChanges();
	}

	public showError(): boolean {
		return !!this.control.errors && this.control.touched;
	}

	public isValid(): boolean {
		return this.control.valid && this.control.touched;
	}

	public isInvalid(): boolean {
		return !!this.control.errors && this.control.touched;
	}

	public isControlDisabled(): boolean {
		return this.control.disabled || this.isDisabled;
	}

	private getErrorMessage(): string {
		if (!this.control.errors) {
			return '';
		}

		const errorShowOrder = this.getErrorShowOrder(this.control.errors);
		for (const errorKey of errorShowOrder) {
			if (this.control.errors[errorKey] && this.errorList[errorKey]) {
				return this.errorList[errorKey]
			}
		}
		return '';
	}

	private shouldShowValidationIcon(element: HTMLInputElement): boolean {
		return (
			element.type === "text" ||
			element.type === "email" ||
			element.type === "tel" ||
			element.type === "password" ||
			element.type === "textarea"
		);
	}

	private getErrorShowOrder(errors: ValidationErrors): string[] {
		const overrides = errors
			? Object.keys(errors).filter((errorKey) =>
			['required', 'pattern', 'mask', 'maxlength', 'minlength'].every(
				(value) => value !== errorKey,
			))
			: [];
		return ['required', ...overrides, 'pattern', 'mask', 'maxlength', 'minlength'];
	}
}
