import {Injectable} from '@angular/core';
import {DatabaseService} from "../../../core/services/database/database.service";
import {BehaviorSubject, catchError, forkJoin, map, Observable, of, switchMap, take, tap} from "rxjs";
import {IProject, projectUtils} from "../../models/project.model";
import isArray from "lodash-es/isArray";
import {LinkPreviewService} from "../../../link-preview/services/link-preview.service";
import {IPreview} from "../../models/preview.model";

@Injectable({
	providedIn: 'root'
})
export class ProjectService {
	private static ID_OFFSET = 100;
	private readonly projects$$: BehaviorSubject<IProject[]> = new BehaviorSubject<IProject[]>([]);
	public readonly projects$: Observable<IProject[]> = this.projects$$
		.pipe(
			map((projects) => {
				return this.sortArray<IProject>(projects, 'id')
			})
		);

	constructor(
		private readonly databaseService: DatabaseService,
		private readonly linkPreviewService: LinkPreviewService
	) {
	}

	public loadProjects(): void {
		this.databaseService.get<IProject[]>('projects')
			.pipe(
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
		let project: IProject = {
			title: title,
			url: url,
			isInternal: isInternal,
			roleDescription: roleDescription
		} as IProject;

		this.projects$.pipe(
			take(1),
			map((projects) => {
				const existing = projects.find(x => x.url === project.url);
				if (!!existing) {
					return projects;
				}

				project = projectUtils.addId(project, ProjectService.ID_OFFSET, projects.length)

				return [
					...projects,
					project
				];
			}),
			map((projects) => {
				return projects.map((project) => {
					return projectUtils.purgePreview(project)
				});
			}),
			tap((projects) => {
				this.databaseService.setValue<IProject[]>('projects', projects);
				this.projects$$.next(projects);
			})
		).subscribe();
	}

	public updateProject(project: IProject): void {
		if (!project || !project.id) {
			throw new Error('Cannot edit a project with no id.')
		}
		const updatedKeys: string[] & (keyof IProject)[] = [];
		let oldProject = this.projects$$.value.find(x => x.id === project.id);
		if (!oldProject) {
			throw new Error("Cannot edit a project that does not exist.");
		}

		Object.keys(project).forEach((key) => {
			if (key !== 'id') {
				if (project[key] !== oldProject[key]) {
					updatedKeys.push(key)
				}
			}
		});

		if (updatedKeys.length === 0) {
			return;
		}

		updatedKeys.forEach((key: keyof IProject) => {
			const updateMethod = this.getUpdateMethod(key);
			if (updateMethod) {
				oldProject = updateMethod(oldProject, project[key]);
			}
		});

		const updatedProjects = this.projects$$.value.filter(x => x.id !== project.id);
		updatedProjects.push(oldProject);

		this.databaseService.setValue('projects', updatedProjects.map((p) => {
			return projectUtils.purgePreview(p);
		}))
	}

	private getUpdateMethod(key: keyof IProject): (...args: any) => IProject {
		switch (key) {
			case "roleDescription":
				return projectUtils.updateRoleDescription;
			case "title":
				return projectUtils.updateTitle;
			case "url":
				return projectUtils.updateUrl;
			default:
				return (project, _) => {
					return project
				};
		}
	}

	private sortArray<T>(collection: T[], key: keyof T): T[] {
		let result: T[] = [];
		for (let i = 0; i < collection.length;) {
			let compRes = 0;
			let lowest: T;
			while (compRes >= 0) {
				let a = collection[i++],
					b = collection[i];
				if (i < collection.length) {
					if (lowest) {
						if (a[key] < lowest[key]) {
							lowest = a;
							compRes = 1;
						} else if (b[key] < lowest[key]) {
							lowest = b;
							compRes = 0
						} else if (a[key] === lowest[key] || b[key] === lowest[key]) {
							compRes = 0;
						} else {
							compRes = -1;
						}
					} else {
						lowest = a;
						if (a[key] < b[key]) {
							lowest = a;
							compRes = 1
						} else if (b[key] < a[key]) {
							lowest = b;
							compRes = 0;
						} else {
							lowest = a;
							compRes = -1
						}
					}
				} else {
					if (!lowest) {
						lowest = a;
					}
					compRes = -1;
				}
			}
			result.push(lowest);
			collection = collection.filter(x => x[key] !== lowest[key]);
			i = 0;
		}
		return result;
	}
}
