import {Injectable} from '@angular/core';
import {DatabaseService} from "../../../core/services/database/database.service";
import {BehaviorSubject, catchError, forkJoin, map, Observable, of, switchMap, take, tap} from "rxjs";
import {IProject, projectUtils} from "../../models/project.model";
import {isArray} from "lodash-es";
import {LinkPreviewService} from "../../../link-preview/services/link-preview.service";
import {IPreview} from "../../models/preview.model";

@Injectable({
	providedIn: 'root'
})
export class ProjectService {
	private readonly projects$$: BehaviorSubject<IProject[]> = new BehaviorSubject<IProject[]>([]);
	public readonly projects$: Observable<IProject[]> = this.projects$$.asObservable();

	constructor(
		private readonly databaseService: DatabaseService,
		private readonly linkPreviewService: LinkPreviewService
	) {
	}

	public loadProjects(): void {
		this.databaseService.get<IProject[]>('projects')
			.pipe(
				take(1),
				map((results) => {
					if (!results || !isArray(results)) {
						return [] as IProject[];
					}
					return results;
				}),
				catchError((err) => {
					console.log(err);
					return of([] as IProject[]);
				}),
				switchMap((projects) => {
					const updatedProjects$: Observable<IProject>[] = [];

					projects.forEach((project) => {
						if (!project.isInternal) {
							const project$ = this.linkPreviewService.getLinkPreview(project.url)
								.pipe(
									map((preview) => {
										return projectUtils.addPreview(project, preview);
									})
								);
							updatedProjects$.push(project$);
						} else {
							const preview: IPreview = {
								url: project.url,
								title: 'Internal Tool - ' + project.title,
								image: undefined,
								description: project.roleDescription
							}
							const updatedProject = projectUtils.addPreview(project, preview);
							updatedProjects$.push(of(updatedProject));
						}
					})

					return forkJoin(updatedProjects$);
				}),
				tap((projects: IProject[]) => {
					this.projects$$.next(projects);
				})
			).subscribe();
	}

	public createProject(title: string, url: string, isInternal: boolean, roleDescription: string): void {
		const project: IProject = {
			title: title,
			url: url,
			isInternal: isInternal,
			roleDescription: roleDescription
		};

		this.projects$.pipe(
			take(1),
			map((projects) => {
				const existing = projects.find(x => x.url ===project.url);
				if (!!existing) {
					return projects;
				}

				return [
					...projects,
					project
				]
			}),
			tap((projects) => {
				this.databaseService.setValue<IProject[]>('projects', projects);
				this.projects$$.next(projects);
			})
		).subscribe();
	}
}
