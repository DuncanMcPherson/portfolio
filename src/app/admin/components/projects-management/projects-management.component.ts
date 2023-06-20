import {Component, OnInit} from '@angular/core';
import {map, Observable} from "rxjs";
import {IProject} from "../../../projects/models/project.model";
import {ProjectService} from "../../../projects/services/project/project.service";
import {CoreModalService} from "../../../core/services/modal/core-modal.service";

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
	) {}

	public ngOnInit(): void {
		this.vm$ = this.projectService.projects$.pipe(
			map((projects) => {
				return {
					projects: projects
				}
			})
		)
	}

	public openCreateProjectModal(): void {

	}
}
