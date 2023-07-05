import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProjectDetailsComponent} from './project-details.component';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ProjectService} from "../../services/project/project.service";
import {autoMockerInstance} from "../../../../test-utils/auto-mocker-plus";
import {Subject} from "rxjs";
import {IProject} from "../../models/project.model";
import * as Chance from 'chance';
import {ProjectBuilder} from "../../../../test-utils/builders/project.builder";
import {NgOptimizedImage} from "@angular/common";
const chance = new Chance();

describe('ProjectDetailsComponent', () => {
	let component: ProjectDetailsComponent;
	let fixture: ComponentFixture<ProjectDetailsComponent>;
	let activatedRouteMock: ActivatedRoute;
	let projectServiceMock: ProjectService;
	let routerMock: Router;

	let projectsSubject: Subject<IProject[]>;
	let paramsSubject: Subject<Params>;

	beforeEach(async () => {
		activatedRouteMock = autoMockerInstance.mockClass(ActivatedRoute);
		projectServiceMock = autoMockerInstance.mockClass(ProjectService);
		routerMock = autoMockerInstance.mockClass(Router);

		projectsSubject = autoMockerInstance.withReturnSubjectForObservableProperty(
			projectServiceMock,
			'projects$',
			[]
		);
		paramsSubject = autoMockerInstance.withReturnSubjectForObservableProperty(
			activatedRouteMock,
			'params',
			{}
		)

		await TestBed.configureTestingModule({
			declarations: [ProjectDetailsComponent],
			providers: [
				{
					provide: ActivatedRoute,
					useValue: activatedRouteMock
				},
				{
					provide: ProjectService,
					useValue: projectServiceMock
				},
				{
					provide: Router,
					useValue: routerMock
				}
			],
			imports: [NgOptimizedImage]
		})
			.compileComponents();

		fixture = TestBed.createComponent(ProjectDetailsComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('ngOnInit', () => {
		[
			null,
			undefined,
			'most definitely not a number',
		].forEach((testCase) => {
			it(`should throw error and re-navigate when id is: ${testCase}`, (done) => {
				paramsSubject.next({id: testCase});
				fixture.detectChanges();
				component.vm$.subscribe({
				next: (result) => {
					expect(result).toBeFalsy();
					expect(routerMock.navigate).toHaveBeenCalled();
					done();
				}});
			})
		});

		it('should return null when no projects loaded', (done) => {
			paramsSubject.next({id: chance.integer({min: 100, max: 200})});
			fixture.detectChanges();
			component.vm$.subscribe({
				next: (result) => {
					expect(result).toBeFalsy();
					expect(routerMock.navigate).not.toHaveBeenCalled();
					done();
				}
			});
		});

		it('should return a project when the project exists', (done) => {
			const id = chance.integer({min: 100, max: 200});
			const project = new ProjectBuilder().withId(id).build();
			projectsSubject.next([project]);
			paramsSubject.next({id: id});

			fixture.detectChanges();

			component.vm$.subscribe((results) => {
				expect(results.project).toEqual(project);
				done();
			})
		})
	})
});
