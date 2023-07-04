import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProjectsHomeComponent} from './projects-home.component';
import {ProjectService} from "../../services/project/project.service";
import {autoMockerInstance} from "../../../../test-utils/auto-mocker-plus";
import {Router} from "@angular/router";

describe('ProjectsHomeComponent', () => {
	let component: ProjectsHomeComponent;
	let fixture: ComponentFixture<ProjectsHomeComponent>;
	let projectServiceMock: ProjectService;
	let routerMock: Router;

	beforeEach(async () => {
		projectServiceMock = autoMockerInstance.mockClass(ProjectService)
		routerMock = autoMockerInstance.mockClass(Router);

		autoMockerInstance.withReturnSubjectForObservableProperty(projectServiceMock, 'projects$', [])
		await TestBed.configureTestingModule({
			declarations: [ProjectsHomeComponent],
			providers: [
				{
					provide: ProjectService,
					useValue: projectServiceMock
				},
				{
					provide: Router,
					useValue: routerMock
				}
			]
		})
			.compileComponents();

		fixture = TestBed.createComponent(ProjectsHomeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
