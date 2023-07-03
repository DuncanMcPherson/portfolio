import {TestBed} from '@angular/core/testing';

import {ProjectService} from './project.service';
import {DatabaseService} from "../../../core/services/database/database.service";
import {LinkPreviewService} from "../../../link-preview/services/link-preview.service";
import {autoMockerInstance} from "../../../../test-utils/auto-mocker-plus";
import {ProjectBuilder} from "../../../../test-utils/builders/project.builder";
import {take} from "rxjs";
import * as Chance from 'chance';

const chance = new Chance();

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
		});
	});

	describe('createProject', () => {
		it('should update project list', (done) => {
			let title = chance.string(), url = chance.string(), isInternal = chance.bool(),
				description = chance.string();

			service.createProject(title, url, isInternal, description);

			expect(databaseServiceMock.setValue).toHaveBeenCalled();
			service.projects$.subscribe((projects) => {
				expect(projects.length).toEqual(1);
				done();
			});
		});

		it('should not update project list when when url already exists in list', (done) => {
			let title = chance.string(), url = chance.string(), isInternal = chance.bool(),
				description = chance.string();
			let project = new ProjectBuilder().withUrl(url).build();
			service['projects$$'].next([project]);

			service.createProject(title, url, isInternal, description);
			expect(databaseServiceMock.setValue).toHaveBeenCalled();
			service.projects$.subscribe((projects) => {
				expect(projects.length).toEqual(1);
				done();
			});
		});
	});

	describe('updateProject', () => {
		it('should throw error when project is null', () => {
			try {
				service.updateProject(null);
				fail('Should have thrown error')
			} catch (e) {
				expect(e.message).toEqual('Cannot edit a project with no id.');
			}
		});

		it('should throw error when project id is null', () => {
			const project = new ProjectBuilder().withId(null).build();
			try {
				service.updateProject(project);
				fail('Should have thrown error')
			} catch (e) {
				expect(e.message).toEqual('Cannot edit a project with no id.');
			}
		});

		it('should throw an error when old project doesn\'t exist', () => {
			try {
				const project = new ProjectBuilder().build();
				service.updateProject(project);
				fail('should have thrown error');
			} catch (e) {
				expect(e.message).toEqual('Cannot edit a project that does not exist.');
			}
		});

		it('should edit the project', () => {
			const oldProject = new ProjectBuilder().build(),
				newProject = new ProjectBuilder().withId(oldProject.id).build();
			service['projects$$'].next([oldProject]);

			service.updateProject(newProject);
			expect(databaseServiceMock.setValue).toHaveBeenCalled();
		})
	})
});
