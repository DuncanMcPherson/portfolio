import {ISection} from "./section.model";

export interface IPost {
	readonly title: string;
	readonly summary: string;
	readonly sections: ReadonlyArray<ISection>;
}

function updateTitle(post: IPost, newTitle: string): IPost {
	return {
		...post,
		title: newTitle
	}
}

function updateSummary(post: IPost, newSummary: string): IPost {
	return {
		...post,
		summary: newSummary
	}
}

function addSection(post: IPost, section: ISection, index?: number): IPost {
	if (index && index < 0) {
		throw new Error(`Cannot insert section at index: ${index}`)
	}
	if (index !== undefined) {
		const sectionsBefore = post.sections.slice(0, index);
		const sectionsAfter = post.sections.slice(index+1);
		const newSections = [
			...sectionsBefore,
			section,
			...sectionsAfter
		];
		return {
			...post,
			sections: newSections
		}
	}

	return {
		...post,
		sections: [
			...post.sections,
			section
		]
	}
}

function removeSection(post: IPost, index: number): IPost {
	if (index < 0) {
		throw new Error(`Cannot remove section at index: ${index}`)
	}
	const updatedSections = [...post.sections.slice(0, index), ...post.sections.slice(index+1)];
	return {
		...post,
		sections: updatedSections
	}
}

export const postUtils = {
	updateTitle,
	updateSummary,
	addSection,
	removeSection
}
