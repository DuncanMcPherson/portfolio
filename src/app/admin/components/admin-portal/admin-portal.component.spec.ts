import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminPortalComponent} from './admin-portal.component';
import {ProjectService} from "../../../projects/services/project/project.service";
import {autoMockerInstance} from "../../../../test-utils/auto-mocker-plus";

describe('AdminPortalComponent', () => {
	let component: AdminPortalComponent;
	let fixture: ComponentFixture<AdminPortalComponent>;

	let projectServiceMock: ProjectService;

	beforeEach(async () => {
		projectServiceMock = autoMockerInstance.mockClass(ProjectService);

		autoMockerInstance.withReturnSubjectForObservableProperty(projectServiceMock, 'projects$', []);

		await TestBed.configureTestingModule({
			declarations: [AdminPortalComponent],
			providers: [
				{
					provide: ProjectService,
					useValue: projectServiceMock
				},
			]
		})
			.compileComponents();

		fixture = TestBed.createComponent(AdminPortalComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should call loadProjects', () => {
		expect(projectServiceMock.loadProjects).toHaveBeenCalled();
	})
});
