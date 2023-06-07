import {Component, forwardRef, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-custom-checkbox',
  templateUrl: './custom-checkbox.component.html',
  styleUrls: ['./custom-checkbox.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => CustomCheckboxComponent),
			multi: true
		}
	]
})
export class CustomCheckboxComponent implements ControlValueAccessor, OnChanges {
	@Input() public accessibilityLabel?: string;
	@Input() public checked?: boolean;
	@Input() public disabled?: boolean;

	public isChecked: boolean;
	public isDisabled: boolean;

	public readonly id: number = Math.floor(Math.random() * 10000);

	private onChange: (checked: boolean) => void;
	private onTouched: () => void;

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['checked']) {
			this.isChecked = !!this.checked;
		}
		if (changes['disabled']) {
			this.isDisabled = !!this.disabled;
		}
	}

	public writeValue(value: boolean): void {
		this.isChecked = !!value;
	}

	public registerOnChange(fn: (value: boolean) => void): void {
		this.onChange = fn;
	}

	public registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}

	public toggleCheckbox(): void {
		this.isChecked = !this.isChecked;
		this.onChange && this.onChange(this.isChecked);
	}

	public markTouched(): void {
		this.onTouched && this.onTouched();
	}
}
