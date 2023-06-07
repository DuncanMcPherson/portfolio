import {CustomCheckboxComponent} from './custom-checkbox.component';
import {SimpleChangeBuilder} from "../../../../test-utils/builders/simple-change.builder";
import {autoMockerInstance} from "../../../../test-utils/auto-mocker-plus";

describe('CustomCheckboxComponent', () => {
	let onChangeSpy: jasmine.Spy<(value: boolean) => void>;
	let onTouchedSpy: jasmine.Spy<() => void>;

	beforeEach(() => {
		onChangeSpy = jasmine.createSpy("onChange");
		onTouchedSpy = jasmine.createSpy("onTouched")
	});

	function createCustomCheckboxComponent(): CustomCheckboxComponent {
		const component = new CustomCheckboxComponent();
		component.registerOnChange(onChangeSpy);
		component.registerOnTouched(onTouchedSpy);
		return component;
	}

	describe('ngOnChanges', () => {
		[
			{previousCheckedState: false, newCheckedState: true},
			{previousCheckedState: true, newCheckedState: false},
			{previousCheckedState: true, newCheckedState: true},
			{previousCheckedState: false, newCheckedState: false}
		].forEach((testCase) => {
			it(`should set checked state to ${testCase.newCheckedState} when previous state is ${testCase.previousCheckedState} and input changes`, () => {
				const component = createCustomCheckboxComponent();
				const changes = {
					checked: new SimpleChangeBuilder()
						.withPreviousValue(testCase.previousCheckedState)
						.withCurrentValue(testCase.newCheckedState)
						.build()
				};

				component.isChecked = testCase.previousCheckedState;
				component.checked = testCase.newCheckedState;

				component.ngOnChanges(changes);

				expect(component.isChecked).toBe(testCase.newCheckedState);
			});
			[undefined, null].forEach((newCheckedState) => {
				it(`should coerce checked value of ${newCheckedState} to false`, () => {
					// Arrange
					const component = createCustomCheckboxComponent();
					const changes = {
						checked: new SimpleChangeBuilder()
							.withPreviousValue(true)
							.withCurrentValue(newCheckedState)
							.build(),
					};

					component.isChecked = true;
					component.checked = newCheckedState;

					// Act
					component.ngOnChanges(changes);

					// Assert
					expect(component.isChecked).toBeFalse();
				});
			});

			[
				{previousDisabledState: false, newDisabledState: true},
				{previousDisabledState: true, newDisabledState: false},
				{previousDisabledState: true, newDisabledState: true},
				{previousDisabledState: false, newDisabledState: false},
			].forEach((testCase) => {
				it(`should set disabled state to ${testCase.newDisabledState} when previous state is ${testCase.previousDisabledState} and input changes`, () => {
					// Arrange
					const component = createCustomCheckboxComponent();
					const changes = {
						disabled: new SimpleChangeBuilder()
							.withPreviousValue(testCase.previousDisabledState)
							.withCurrentValue(testCase.newDisabledState)
							.build(),
					};

					component.isDisabled = testCase.previousDisabledState;
					component.disabled = testCase.newDisabledState;

					// Act
					component.ngOnChanges(changes);

					// Assert
					expect(component.isDisabled).toBe(testCase.newDisabledState);
				});
			});

			[undefined, null].forEach((newDisabledState) => {
				it(`should coerce disabled value of ${newDisabledState} to false`, () => {
					// Arrange
					const component = createCustomCheckboxComponent();
					const changes = {
						disabled: new SimpleChangeBuilder()
							.withPreviousValue(true)
							.withCurrentValue(newDisabledState)
							.build(),
					};

					component.isDisabled = true;
					component.disabled = newDisabledState;

					// Act
					component.ngOnChanges(changes);

					// Assert
					expect(component.isDisabled).toBeFalse();
				});
			});
		});

		describe("writeValue", () => {
			[
				{value: true, expected: true},
				{value: false, expected: false},
				{value: undefined, expected: false},
				{value: null, expected: false},
			].forEach((testCase) => {
				it(`should set checked state to ${testCase.expected} when value is ${testCase.value}`, () => {
					// Arrange
					const component = createCustomCheckboxComponent();

					// Act
					component.writeValue(testCase.value);

					// Assert
					expect(component.isChecked).toBe(testCase.expected);
				});
			});
		});

		describe("toggleCheckbox", () => {
			[
				{initiallyChecked: false, expected: true},
				{initiallyChecked: true, expected: false},
			].forEach((testCase) => {
				it(`should set checked state to ${testCase.expected} and notify angular of change when checked state is ${testCase.initiallyChecked}`, () => {
					// Arrange
					const component = createCustomCheckboxComponent();
					component.isChecked = testCase.initiallyChecked;

					autoMockerInstance.resetSpy(onChangeSpy);

					// Act
					component.toggleCheckbox();

					// Assert
					expect(component.isChecked).toBe(testCase.expected);
					expect(onChangeSpy).toHaveBeenCalledWith(testCase.expected);
				});
			});

			it("should not break when no change handler is set", () => {
				// Arrange
				const component = createCustomCheckboxComponent();
				component.registerOnChange(undefined);

				// Act
				const action = () => component.toggleCheckbox();

				// Assert
				expect(action).not.toThrow();
			});
		});

		describe("markTouched", () => {
			it("should notify angular that control was touched", () => {
				// Arrange
				const component = createCustomCheckboxComponent();

				autoMockerInstance.resetSpy(onTouchedSpy);

				// Act
				component.markTouched();

				// Assert
				expect(onTouchedSpy).toHaveBeenCalled();
			});

			it("should not break when no touched handler is set", () => {
				// Arrange
				const component = createCustomCheckboxComponent();
				component.registerOnTouched(undefined);

				// Act
				const action = () => component.markTouched();

				// Assert
				expect(action).not.toThrow();
			});
		});
	});
});
