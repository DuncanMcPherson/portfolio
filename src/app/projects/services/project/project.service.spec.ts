import {TestBed} from '@angular/core/testing';

import {ProjectService} from './project.service';
import {DatabaseService} from "../../../core/services/database/database.service";
import {LinkPreviewService} from "../../../link-preview/services/link-preview.service";
import {autoMockerInstance} from "../../../../test-utils/auto-mocker-plus";
import {ProjectBuilder} from "../../../../test-utils/builders/project.builder";
import {take} from "rxjs";

describe('ProjectService', () => {
	let service: ProjectService;
	let databaseServiceMock: DatabaseService;
	let linkPreviewServiceMock: LinkPreviewService;

	beforeEach(() => {
		databaseServiceMock = autoMockerInstance.mockClass(DatabaseService);
		linkPreviewServiceMock = autoMockerInstance.mockClass(LinkPreviewService);

		TestBed.configureTestingModule({
			providers: [
				{
					provide: DatabaseService,
					useValue: databaseServiceMock
				},
				{
					provide: LinkPreviewService,
					useValue: linkPreviewServiceMock
				}
			]
		});
		service = TestBed.inject(ProjectService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('loadProjects', () => {
		it('should set projects$$ value to a filled array', (done) => {
			const result = [
				new ProjectBuilder().withIsInternal(true).build(),
				new ProjectBuilder().withIsInternal(true).build(),
				new ProjectBuilder().withIsInternal(true).build(),
				new ProjectBuilder().withIsInternal(true).build()
			];
			autoMockerInstance.withReturnObservable(databaseServiceMock.get, result);

			service.loadProjects();

			service.projects$.pipe(
				take(1)
			).subscribe((projects) => {
				expect(projects.length).toEqual(result.length);
				done();
			});
		});

		[
			null, undefined, 1, 'test string', {property: 'I should not be like this'}
		].forEach((testCase) => {
			it(`should return an empty array when get returns a non array: ${testCase}`, (done) => {
				service['projects$$'].next(undefined);
				let index = 0;
				service.projects$.subscribe((projects) => {
					expect(projects).toEqual([]);
					if (index++ === 1) {
						done();
					}
				});

				autoMockerInstance.withReturnObservable(databaseServiceMock.get, testCase);

				service.loadProjects();
			});
		});

		it('should handle an error', (done) => {
			let consoleSpy = spyOn(console, 'log');
			autoMockerInstance.withReturnSubjectWithErrorAsObservable(databaseServiceMock.get, 'Could not access database');
			service.loadProjects();
			expect(consoleSpy).toHaveBeenCalledWith('Could not access database');
			service.projects$.subscribe((projects) => {
				expect(projects.length).toEqual(0);
				done();
			});
		})
	})
});
