import {Component, OnInit} from '@angular/core';
import {ProjectService} from "../../../projects/services/project/project.service";
import {map, Observable} from "rxjs";
import {IProject} from "../../../projects/models/project.model";

@Component({
  selector: 'app-admin-portal',
  templateUrl: './admin-portal.component.html',
  styleUrls: ['./admin-portal.component.scss']
})
export class AdminPortalComponent implements OnInit {
	public vm$: Observable<{ projects: IProject[] }>;
	constructor(
		private readonly projectService: ProjectService
	) {}

	public ngOnInit(): void {
		this.vm$ = this.projectService.projects$.pipe(
			map(projects => ({projects}))
		);

		this.projectService.loadProjects();
	}
}
