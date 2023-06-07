import {SimpleChange} from "@angular/core";

export class SimpleChangeBuilder<T> {
	private _previousValue: T;
	private _currentValue: T;
	private _isFirstChange: boolean;

	public withPreviousValue(previousValue: T): SimpleChangeBuilder<T> {
		this._previousValue = previousValue;
		return this;
	}

	public withCurrentValue(currentValue: T): SimpleChangeBuilder<T> {
		this._currentValue = currentValue;
		return this;
	}

	public withIsFirstChange(isFirstChange: boolean): SimpleChangeBuilder<T> {
		this._isFirstChange = isFirstChange;
		return this;
	}

	public build(): SimpleChange {
		return {
			currentValue: this._currentValue,
			isFirstChange: (): boolean => this._isFirstChange,
			previousValue: this._previousValue,
			firstChange: this._isFirstChange
		};
	}
}
