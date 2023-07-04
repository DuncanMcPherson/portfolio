import {Component, OnInit} from '@angular/core';
import {ProjectService} from "../../services/project/project.service";
import {IProject} from "../../models/project.model";
import {map, Observable} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-projects-home',
  templateUrl: './projects-home.component.html',
  styleUrls: ['./projects-home.component.scss']
})
export class ProjectsHomeComponent implements OnInit {
	public vm$: Observable<{projects: IProject[]}> = this.projectService.projects$.pipe(
		map((projects) => ({projects}))
	);
	constructor(
		private readonly projectService: ProjectService,
		private readonly router: Router
	) {}

	public ngOnInit(): void {
		this.projectService.loadProjects();
	}

	public navigateToProjectDetails(projectId: number): void {
		void this.router.navigate(['portfolio', projectId])
	}
}
