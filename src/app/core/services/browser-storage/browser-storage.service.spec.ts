import {TestBed} from '@angular/core/testing';

import {BrowserStorageService} from './browser-storage.service';
import {PreviewBuilder} from "../../../../test-utils/builders/preview.builder";
import {BrowserStorageKey, BrowserStorageLocation} from "./browser-storage.enum";
import {IPreview} from "../../../projects/models/preview.model";

describe('BrowserStorageService', () => {
	let service: BrowserStorageService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(BrowserStorageService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('getParsedItem', () => {
		it('should get item stored at key if it exists', () => {
			const expectedObject = new PreviewBuilder().build();
			service.setOrUpdateItem(BrowserStorageLocation.local, 'unit-tests' as BrowserStorageKey, expectedObject);

			const result = service.getParsedItem<IPreview>(BrowserStorageLocation.local, 'unit-tests' as BrowserStorageKey);

			expect(result).toEqual(expectedObject);
		});

		it('should get null when Item doesn\'t exist', () => {
			const result = service.getParsedItem<IPreview>(BrowserStorageLocation.local, 'unit-tests2' as BrowserStorageKey);

			expect(result).toEqual(null);
		});
	});

	describe('getItem', () => {
		it('should return a string when the key exists', () => {
			const item = new PreviewBuilder().build();
			const expectedString = JSON.stringify(item);
			service.setOrUpdateItem(BrowserStorageLocation.local, 'unit-tests3' as BrowserStorageKey, item);

			const result = service.getItem(BrowserStorageLocation.local, 'unit-tests3' as BrowserStorageKey);

			expect(typeof result).toEqual('string');
			expect(result).toEqual(expectedString);
		});

		it('should return null when key does not exist', () => {
			const result = service.getItem(BrowserStorageLocation.local, 'unit-tests4' as BrowserStorageKey);

			expect(result).toBeFalsy();
		});
	});

	describe('removeItem', () => {
		it('should remove the key if it exists', () => {
			const item = new PreviewBuilder().build();
			service.setOrUpdateItem(BrowserStorageLocation.local, BrowserStorageKey.campaign, item);
			expect(service.getParsedItem<IPreview>(BrowserStorageLocation.local, BrowserStorageKey.campaign)).toEqual(item);

			service.removeItem(BrowserStorageLocation.local, BrowserStorageKey.campaign);

			const result = service.getParsedItem<IPreview>(BrowserStorageLocation.local, BrowserStorageKey.campaign);

			expect(result).toBeFalsy();
		})
	})
});
