import {IPreview} from "./preview.model";

export interface IProject {
	readonly title: string;
	readonly url?: string;
	readonly preview?: IPreview;
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

export const projectUtils = {
	addPreview,
	updateTitle,
	updateUrl
}
