export interface ISection {
	readonly title: string;
	readonly text: string;
	readonly codeDisplay: string;
}

function updateTitle(section: ISection, newTitle: string): ISection {
	return {
		...section,
		title: newTitle
	};
}

function updateText(section: ISection, newText: string): ISection {
	return {
		...section,
		text: newText
	};
}

function updateCodeDemo(section: ISection, updatedDisplay: string): ISection {
	return {
		...section,
		codeDisplay: updatedDisplay
	}
}

export const sectionUtils = {
	updateTitle,
	updateText,
	updateCodeDemo
};
