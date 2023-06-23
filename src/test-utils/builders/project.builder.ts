import * as Chance from 'chance';
import {IPreview} from "../../app/projects/models/preview.model";
import {PreviewBuilder} from "./preview.builder";
import {IProject} from "../../app/projects/models/project.model";
const chance = new Chance();

export class ProjectBuilder {
	private _title: string = chance.string();
	private _url: string = chance.url();
	private _roleDescription: string = chance.string({ length: 50});
	private _isInternal: boolean = chance.bool();
	private _preview: IPreview | undefined = this._isInternal ? undefined : new PreviewBuilder().withUrl(this._url).build();
	private _id: number = chance.integer({min: 100, max: 999})

	public withTitle(title: string): ProjectBuilder {
		this._title = title;
		return this;
	}

	public withUrl(url: string): ProjectBuilder {
		this._url = url;
		return this;
	}

	public withRoleDescription(description: string): ProjectBuilder {
		this._roleDescription = description;
		return this;
	}

	public withIsInternal(isInternal: boolean): ProjectBuilder {
		this._isInternal = isInternal;
		return this;
	}

	public withPreview(preview: IPreview): ProjectBuilder {
		this._preview = preview;
		return this;
	}

	public build(): IProject {
		return {
			title: this._title,
			url: this._url,
			isInternal: this._isInternal,
			roleDescription: this._roleDescription,
			id: this._id,
			preview: this._preview
		}
	}
}
