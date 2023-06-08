import {Component} from "@angular/core";
import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {AnimatedLabelDirective} from "./animated-label.directive";

@Component({
	template: `<input type="text" appAnimatedLabel="The Label" placeholder="The Label"/>`
})
class TestAnimatedLabelInputComponent {
}

@Component({
	template: `
		<select appAnimatedLabel="The Label">
			<option value=""></option>
			<option value="1">Value</option>
		</select>
	`
})
class TestAnimatedLabelSelectComponent {
}

describe("AnimatedLabelDirective", () => {
	describe("on input element", () => {
		let fixture: ComponentFixture<TestAnimatedLabelInputComponent>;

		beforeEach(
			waitForAsync(() => {
				TestBed.configureTestingModule({
					declarations: [TestAnimatedLabelInputComponent, AnimatedLabelDirective]
				}).compileComponents();
			})
		);

		beforeEach(() => {
			fixture = TestBed.createComponent(TestAnimatedLabelInputComponent);
			fixture.detectChanges();
		});


		it("should wrap input in div with 'is-input' and 'form-control-wrapper' classes", () => {
			const wrapperDivElement = fixture.debugElement.nativeElement.querySelector(
				'div.form-control-wrapper.is-input'
			);
			expect(wrapperDivElement).toBeDefined();
			expect(wrapperDivElement.children[0].tagName).toBe("INPUT");
		})
		it("should remove value of placeholder on input", () => {
			// Arrange / Act
			const inputElement = fixture.debugElement.nativeElement.querySelector("input");

			// Assert
			expect(inputElement.placeholder).toBe("");
		});

		it("should add label with label text", () => {
			// Arrange / Act
			const labelElement = fixture.debugElement.nativeElement.querySelector("label");

			// Assert
			expect(labelElement.innerHTML).toContain("The Label");
		});

		it("should have 'animated' class on label when input has value and input is not focused", (done) => {
			// Arrange
			const inputElement: HTMLInputElement = fixture.debugElement.nativeElement.querySelector(
				"input",
			);
			const labelElement = fixture.debugElement.nativeElement.querySelector("label");

			const newValue = "Test name";

			expect(labelElement.classList).not.toContain("animated");

			// Act;
			inputElement.value = newValue;
			inputElement.setAttribute("value", newValue);

			// Assert
			setTimeout(() => {
				expect(labelElement.classList).toContain("animated");
				done();
			});
		});

		it("should have not have 'animated' class on label when input is blurred and has no value", () => {
			// Arrange
			const inputElement = fixture.debugElement.nativeElement.querySelector("input");
			const labelElement = fixture.debugElement.nativeElement.querySelector("label");

			expect(labelElement.classList).not.toContain("animated");

			// Act
			inputElement.focus();
			inputElement.blur();

			// Assert
			expect(labelElement.classList).not.toContain("animated");
		});

		it("should set id on input equal to 'for' attribute on label", () => {
			// Arrange
			const inputElement = fixture.debugElement.nativeElement.querySelector("input");
			const labelElement = fixture.debugElement.nativeElement.querySelector("label");

			expect(inputElement.id).toBeTruthy();

			const inputId = inputElement.id;

			// Assert
			expect(labelElement.htmlFor).toEqual(inputId);
		});
	});

	describe("on select element", () => {
		let fixture: ComponentFixture<TestAnimatedLabelSelectComponent>;

		beforeEach(
			waitForAsync(() => {
				TestBed.configureTestingModule({
					declarations: [TestAnimatedLabelSelectComponent, AnimatedLabelDirective],
					imports: [],
				}).compileComponents();
			}),
		);

		beforeEach(() => {
			fixture = TestBed.createComponent(TestAnimatedLabelSelectComponent);
			fixture.detectChanges();
		});

		it("should wrap select in div with 'is-select' and 'form-control-wrapper' classes", () => {
			// Arrange / Act / Assert
			const wrapperDivElement = fixture.debugElement.nativeElement.querySelector(
				"div.form-control-wrapper.is-select",
			);
			expect(wrapperDivElement).toBeDefined();
			expect(wrapperDivElement.children[0].tagName).toBe("SELECT");
		});

		it("should add label with label text", () => {
			// Arrange / Act
			const labelElement = fixture.debugElement.nativeElement.querySelector("label");

			// Assert
			expect(labelElement.innerHTML).toContain("The Label");
		});

		it("should have not have 'animated' class on label when select is blurred and has no value", () => {
			// Arrange
			const selectElement = fixture.debugElement.nativeElement.querySelector("select");
			const labelElement = fixture.debugElement.nativeElement.querySelector("label");

			expect(labelElement.classList).not.toContain("animated");

			// Act
			selectElement.focus();
			selectElement.blur();

			// Assert
			expect(labelElement.classList).not.toContain("animated");
		});

		it("should set id on select equal to 'for' attribute on label", () => {
			// Arrange
			const selectElement = fixture.debugElement.nativeElement.querySelector("select");
			const labelElement = fixture.debugElement.nativeElement.querySelector("label");

			expect(selectElement.id).toBeTruthy();

			const selectId = selectElement.id;

			// Assert
			expect(labelElement.htmlFor).toEqual(selectId);
		});
	});
});
