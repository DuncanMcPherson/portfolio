import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectService} from "../../services/project/project.service";
import {combineLatestWith, filter, map, Observable, tap, throwError} from "rxjs";
import {IProject} from "../../models/project.model";

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
	public vm$: Observable<{ project: IProject }>;

	private loadTimeoutId;

	constructor(
		private readonly activatedRoute: ActivatedRoute,
		private readonly projectService: ProjectService,
		private readonly router: Router,
	) {}

	public ngOnInit(): void {
		this.projectService.loadProjects();
		this.vm$ = this.projectService.projects$.pipe(
			combineLatestWith(this.activatedRoute.params),
			map(([projects, params]) => {
				const projectId = params['id'];
				if (!projectId) {
					throwError(() => new Error('Somehow got to the page that requires an id'))
					void this.router.navigate(['portfolio'])
				}
				if (isNaN(projectId)) {
					throwError(() => new Error('Id is not a number'))
					void this.router.navigate(['portfolio']);
				}
				if (!projects.length) {
					return null;
				}
				const project = projects.find(x => x.id == projectId);
				if (!project) {
					this.loadTimeoutId = setTimeout(() => {
						console.warn('Attempted to load page with invalid project id. Redirecting...')
						void this.router.navigate(['portfolio'])
					}, 10_000)
					return null;
				}
				clearTimeout(this.loadTimeoutId);
				return {
					project
				};
			})
		);
	}
}
