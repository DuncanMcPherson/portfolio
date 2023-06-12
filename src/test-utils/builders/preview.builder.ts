import * as Chance from 'chance';
import {IPreview} from "../../app/projects/models/preview.model";
const chance = new Chance();

export class PreviewBuilder {
	private _url: string = chance.string();
	private _description: string = chance.string();
	private _title: string = chance.string();
	private _image: string = chance.string();

	public withUrl(url: string): PreviewBuilder {
		this._url = url;
		return this;
	}

	public withDescription(description: string): PreviewBuilder {
		this._description = description;
		return this;
	}

	public withTitle(title: string): PreviewBuilder {
		this._title = title;
		return this;
	}

	public withImage(image: string): PreviewBuilder {
		this._image = image;
		return this;
	}

	public build(): IPreview {
		return {
			url: this._url,
			title: this._title,
			image: this._image,
			description: this._description
		};
	}
}
