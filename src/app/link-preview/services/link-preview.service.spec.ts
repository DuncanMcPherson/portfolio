import {TestBed} from '@angular/core/testing';

import {LinkPreviewService} from './link-preview.service';
import {HttpClient} from "@angular/common/http";
import {EnvironmentService} from "../../core/services/environment/environment.service";
import {autoMockerInstance} from "../../../test-utils/auto-mocker-plus";
import {PreviewBuilder} from "../../../test-utils/builders/preview.builder";
import * as Chance from 'chance';
const chance = new Chance();

describe('LinkPreviewService', () => {
	let service: LinkPreviewService;
	let httpMock: HttpClient;
	let environmentServiceMock: EnvironmentService;

	beforeEach(() => {
		httpMock = autoMockerInstance.mockClass(HttpClient);
		environmentServiceMock = autoMockerInstance.mockClass(EnvironmentService);
		TestBed.configureTestingModule({
			providers: [
				{
					provide: HttpClient,
					useValue: httpMock
				},
				{
					provide: EnvironmentService,
					useValue: environmentServiceMock
				}
			]
		});
		service = TestBed.inject(LinkPreviewService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe("getLinkPreview", () => {
		it('should return a link preview when no errors', (done) => {
			const preview = new PreviewBuilder()
				.build();
			autoMockerInstance.withReturnObservable(httpMock.get, preview);
			autoMockerInstance.withReturnGetterValue(environmentServiceMock, "linkPreviewKey", chance.string());
			autoMockerInstance.withReturnGetterValue(environmentServiceMock, "linkPreviewApi", chance.url());

			service.getLinkPreview(preview.url)
				.subscribe(
					(result) => {
						expect(result).toEqual(preview);
						done();
					}
				);
		})

		it("should return preview with only url when call makes an error", (done) => {
			autoMockerInstance.withReturnGetterValue(environmentServiceMock, "linkPreviewKey", chance.string());
			autoMockerInstance.withReturnGetterValue(environmentServiceMock, "linkPreviewApi", chance.url());
			autoMockerInstance.withReturnThrowObservable(httpMock.get);
			const expectedUrl = chance.url()

			service.getLinkPreview(expectedUrl)
				.subscribe((result) => {
					expect(result.url).toEqual(expectedUrl);
					expect(result.image).toBeFalsy();
					expect(result.description).toBeFalsy();
					expect(result.title).toBeFalsy();
					done();
				})
		})
	})
});
