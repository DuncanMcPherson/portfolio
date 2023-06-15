import {IPreview} from "./preview.model";

export interface IProject {
	readonly title: string;
	readonly url: string;
	readonly preview?: IPreview;
	readonly isInternal: boolean;
	readonly roleDescription: string;
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

export const projectUtils = {
	addPreview,
	updateTitle,
	updateUrl,
	updateRoleDescription
}
