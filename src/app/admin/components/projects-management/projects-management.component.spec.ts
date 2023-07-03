import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProjectsManagementComponent} from './projects-management.component';
import {ProjectService} from "../../../projects/services/project/project.service";
import {CoreModalService} from "../../../core/services/modal/core-modal.service";
import {autoMockerInstance} from "../../../../test-utils/auto-mocker-plus";
import {ModalResultAction} from "../../../core/models/modal-result";
import {CreateProjectModalComponent} from "../create-project-modal/create-project-modal.component";
import {ProjectBuilder} from "../../../../test-utils/builders/project.builder";
import {EditProjectModalComponent} from "../edit-project-modal/edit-project-modal.component";

describe('ProjectsManagementComponent', () => {
	let component: ProjectsManagementComponent;
	let fixture: ComponentFixture<ProjectsManagementComponent>;
	let projectsServiceMock: ProjectService;
	let modalServiceMock: CoreModalService;

	beforeEach(async () => {
		projectsServiceMock = autoMockerInstance.mockClass(ProjectService);
		modalServiceMock = autoMockerInstance.mockClass(CoreModalService);

		autoMockerInstance.withReturnSubjectForObservableProperty(projectsServiceMock, 'projects$', [])

		await TestBed.configureTestingModule({
			declarations: [ProjectsManagementComponent],
			providers: [
				{
					provide: ProjectService,
					useValue: projectsServiceMock
				},
				{
					provide: CoreModalService,
					useValue: modalServiceMock
				}
			]
		})
			.compileComponents();

		fixture = TestBed.createComponent(ProjectsManagementComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
		expect(component.vm$).toBeTruthy();
	});

	describe('openCreateProjectModal', () => {
		it('should call openModal', () => {
			autoMockerInstance.withReturnObservable(modalServiceMock.openModal, {result: ModalResultAction.close, data: null});
			component.openCreateProjectModal();

			expect(modalServiceMock.openModal).toHaveBeenCalledWith(CreateProjectModalComponent, void 0);
			expect(projectsServiceMock.createProject).not.toHaveBeenCalled();
		});

		it('should call create project when result is accept', () => {
			 const project = new ProjectBuilder().withIsInternal(true).build();
			 autoMockerInstance.withReturnObservable(modalServiceMock.openModal, {
				 result: ModalResultAction.accept,
				 data: project
			 });
			 component.openCreateProjectModal();
			 expect(modalServiceMock.openModal).toHaveBeenCalledWith(CreateProjectModalComponent, void 0);
			 expect(projectsServiceMock.createProject).toHaveBeenCalledWith(project.title, project.url, project.isInternal, project.roleDescription);
		});
	});

	describe("openEditProjectModal", () => {
		it('should call open modal and not update project', () => {
			autoMockerInstance.withReturnObservable(modalServiceMock.openModal, {result: ModalResultAction.close, data: null});
			const project = new ProjectBuilder().build()
			component.openEditProjectModal(project);

			expect(modalServiceMock.openModal).toHaveBeenCalledWith(EditProjectModalComponent, {project});
			expect(projectsServiceMock.updateProject).not.toHaveBeenCalled();
		});

		it('should call update project when result is accept', () => {
			const project = new ProjectBuilder().build();
			autoMockerInstance.withReturnObservable(modalServiceMock.openModal, {result: ModalResultAction.accept, data: project});

			component.openEditProjectModal(project);

			expect(modalServiceMock.openModal).toHaveBeenCalledWith(EditProjectModalComponent, {project});
			expect(projectsServiceMock.updateProject).toHaveBeenCalledWith(project);
		})
	})
});
