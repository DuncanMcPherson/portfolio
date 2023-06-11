import {TestBed} from '@angular/core/testing';

import {CoreModalService} from './core-modal.service';
import {BsModalRef, ModalModule} from "ngx-bootstrap/modal";
import {AbstractModal} from "../../models/abstract-modal";
import {Component} from "@angular/core";

import * as Chance from 'chance';
import {ModalResultAction} from "../../models/modal-result";

const chance = new Chance();

@Component({
	template: `
		<p class="test-number-display">{{testNumber}}</p>
	`
})
class TestAbstractModal extends AbstractModal<{ testNumber: number }, void> {
	public testNumber: number;
}

describe('CoreModalService', () => {
	let service: CoreModalService;
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ModalModule.forRoot()]
		});
		service = TestBed.inject(CoreModalService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('openModal', () => {
		it('should open modal when modalRef is null/undefined', () => {
			expect(service["bsModalRef"]).toBeFalsy();
			service.openModal(TestAbstractModal, {testNumber: chance.integer()})
				.subscribe((result) => {
					expect(result.result).toEqual(ModalResultAction.accept);
				});

			const component = (service["bsModalRef"].content as TestAbstractModal);
			component["close"](ModalResultAction.accept)
		});

		it('should not open new modal when modalRef is defined', () => {
			service["bsModalRef"] = {} as BsModalRef;
			service.openModal(TestAbstractModal, {testNumber: chance.integer()})
				.subscribe({
					next: () => {
						fail('Should not have success');
					},
					error: (err: Error) => {
						expect(err.message).toEqual('Cannot open multiple modals simultaneously');
					}
				})
		})
	})
});
