import {TestBed} from '@angular/core/testing';

import {FormHelperService} from './form-helper.service';
import {FormControl} from "@angular/forms";
import {readObservableSynchronouslyAfterAction} from "../../../test-utils/read-observable-synchronously";

describe('FormHelperService', () => {
	let service: FormHelperService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(FormHelperService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('extractTouchedChanges', () => {
		it('should return an observable that emits true when the control is touched', () => {
			const control = new FormControl()

			const touched$ = service.extractTouchedChanges(control);

			const touched = readObservableSynchronouslyAfterAction(touched$, () => control.markAsTouched());

			expect(touched).toEqual(true);
			expect(control.touched).toEqual(true);
		});

		it('should return an observable that emits false when the control is untouched', () => {
			const control = new FormControl()
			control.markAsTouched();

			const touched$ = service.extractTouchedChanges(control);

			const touched = readObservableSynchronouslyAfterAction(touched$, () => control.markAsUntouched());

			expect(touched).toBeFalse();
			expect(control.touched).toBeFalse();
		})
	})
});
