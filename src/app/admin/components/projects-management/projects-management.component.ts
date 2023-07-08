import {Component, OnInit} from '@angular/core';
import {map, Observable} from "rxjs";
import {IProject} from "../../../projects/models/project.model";
import {ProjectService} from "../../../projects/services/project/project.service";
import {CoreModalService} from "../../../core/services/modal/core-modal.service";
import {CreateProjectModalComponent} from "../create-project-modal/create-project-modal.component";
import {IModalResult, ModalResultAction} from "../../../core/models/modal-result";
import {EditProjectModalComponent} from "../edit-project-modal/edit-project-modal.component";

@Component({
	selector: 'app-projects-management',
	templateUrl: './projects-management.component.html',
	styleUrls: ['./projects-management.component.scss']
})
export class ProjectsManagementComponent implements OnInit {
	public vm$: Observable<{ projects: IProject[] }>;

	constructor(
		private readonly projectService: ProjectService,
		private readonly modalService: CoreModalService,
	) {
	}

	public ngOnInit(): void {
		this.projectService.loadProjects();
		this.vm$ = this.projectService.projects$.pipe(
			map((projects) => {
				return {
					projects: projects
				}
			})
		)
	}

	public openCreateProjectModal(): void {
		this.modalService
			.openModal(CreateProjectModalComponent, void 0)
			.subscribe({
				next: (projectResult: IModalResult<IProject>) => {
					if (projectResult.result === ModalResultAction.accept) {
						const project = projectResult.data;
						this.projectService.createProject(project.title, project.url, project.isInternal, project.roleDescription, project.customDescription)
					}
				},
				error: (err) => {
					console.log(err);
				}
			})
	}

	public openEditProjectModal(project: IProject): void {
		this.modalService
			.openModal<{
				project: IProject
			}, IProject, typeof EditProjectModalComponent>(EditProjectModalComponent, {project})
			.subscribe((result) => {
				if (result.result === ModalResultAction.accept) {
					const project = result.data
					this.projectService.updateProject(project)
				}
			})
	}
}
