import {IPreview} from "./preview.model";

export interface IProject {
	readonly id: number;
	readonly title: string;
	readonly url: string;
	readonly preview?: IPreview;
	readonly isInternal: boolean;
	readonly roleDescription: string;
	readonly customDescription?: string;
}

function addPreview(project: IProject, preview: IPreview): IProject {
	return {
		...project,
		preview: preview
	}
}

function updateTitle(project: IProject, newTitle: string): IProject {
	return {
		...project,
		title: newTitle
	}
}

function updateUrl(project: IProject, newUrl: string): IProject {
	return {
		...project,
		url: newUrl
	}
}

function updateRoleDescription(project: IProject, newDescription: string): IProject {
	return {
		...project,
		roleDescription: newDescription
	}
}

function purgePreview(project: IProject): IProject {
	return {
		title: project.title,
		url: project.url,
		roleDescription: project.roleDescription,
		isInternal: project.isInternal,
		id: project.id
	};
}

function addId(project: IProject, offset: number, currentNumberOfProjects: number): IProject {
	const id = offset + currentNumberOfProjects;
	if (project.id) {
		return project;
	}

	return {
		...project,
		id: id
	}
}

function updateCustomProjectDescription(project: IProject, newDescription: string): IProject {
	return {
		...project,
		customDescription: newDescription
	}
}

export const projectUtils = {
	addPreview,
	updateTitle,
	updateUrl,
	updateRoleDescription,
	purgePreview,
	addId,
	updateCustomProjectDescription
}
